import { Component, OnInit } from '@angular/core';
import { Colaborador } from '../../models/colaborador.model';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import axios, { AxiosError } from 'axios';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-visualisar-colaborador',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './visualisar-colaborador.component.html',
  styleUrls: ['./visualisar-colaborador.component.css'],
})
export class VisualisarColaboradorComponent implements OnInit {
  colaboradores: Colaborador[] = [];
  colaboradorForm!: FormGroup;
  mensagemErro: string | null = null;
  colaboradorEditando: Colaborador | null = null;

  private apiUrl = `${environment.apiUrl}/usuario/colaboradores`;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.colaboradorForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      senha: ['', Validators.required],
    });

    this.carregarColaboradores();
  }

  async carregarColaboradores(): Promise<void> {
    this.mensagemErro = null;

    try {
      const response = await axios.get<Colaborador[]>(this.apiUrl);
      this.colaboradores = response.data;
    } catch (err) {
      this.tratarErro(err, 'telecharger');
    }
  }

  async excluir(id?: number): Promise<void> {
    if (!id) {
      this.mensagemErro = 'ID du colaborateur  inválide.';
      return;
    }

    if (!confirm('Voulez-vous vraiment supprimer ce collaborateur ?')) return;

    try {
      await axios.delete(`${this.apiUrl}/${id}`);
      await this.carregarColaboradores();
    } catch (err) {
      this.tratarErro(err, 'supprimer');
    }
  }

  editar(colaborador: Colaborador): void {
    this.colaboradorEditando = { ...colaborador };
    this.colaboradorForm.patchValue(colaborador);

    const modal = document.getElementById('modalEditar') as HTMLDialogElement;
    modal?.showModal();
  }

  async salvarEdicao(): Promise<void> {
    if (!this.colaboradorEditando || this.colaboradorForm.invalid) return;

    const atualizado: Colaborador = {
      ...this.colaboradorEditando,
      ...this.colaboradorForm.value,
    };

    try {
      await axios.put(`${this.apiUrl}/${atualizado.id}`, atualizado);
      await this.carregarColaboradores();
      this.fecharModal();
    } catch (err) {
      this.tratarErro(err, 'mettre à jour');
    }
  }

  fecharModal(): void {
    this.colaboradorEditando = null;
    const modal = document.getElementById('modalEditar') as HTMLDialogElement;
    modal?.close();
  }

  private tratarErro(error: unknown, acao: string): void {
    let mensagem = `Erro ao ${acao}.`;

    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<any>;
      if (err.response?.status === 401) {
        this.router.navigate(['/login']);
      } else if (typeof err.response?.data === 'string') {
        mensagem += ' ' + err.response.data;
      } else if (err.response?.data?.message) {
        mensagem += ' ' + err.response.data.message;
      } else if (err.message) {
        mensagem += ' ' + err.message;
      }
    }

    this.mensagemErro = mensagem;
  }
}
