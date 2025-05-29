import { Component, OnInit } from '@angular/core';
import { ColaboradorService } from './../../services/colaborador.service';
import { Colaborador } from '../../models/colaborador.model';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './../../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

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

  constructor(
    private colaboradorService: ColaboradorService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Inicializa o formulário de edição de colaborador
    this.colaboradorForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      senha: ['', Validators.required],
    });

    // Carrega os dados dos colaboradores ao iniciar
    this.carregarColaboradores();
  }

  // Função para carregar todos os colaboradores
  carregarColaboradores(): void {
    this.colaboradorService.listar().subscribe({
      next: (dados) => (this.colaboradores = dados),
      error: (err) => {
        this.mensagemErro = 'Erro ao carregar: ' + err.message;
        if (err.status === 401) {
          this.router.navigate(['/login']);  // Redireciona para o login se o erro for 401
        }
      },
    });
  }

  // Função para excluir um colaborador
  excluir(id?: number): void {
    if (id === undefined) {
      this.mensagemErro = 'ID do colaborador inválido.';
      return;
    }

    if (!confirm('Deseja realmente excluir este colaborador?')) return;

    // Chama o serviço para excluir o colaborador
    this.colaboradorService.excluir(id).subscribe({
      next: () => {
        this.carregarColaboradores();  // Recarrega a lista de colaboradores após a exclusão
      },
      error: (err) => {
        this.mensagemErro = 'Erro ao excluir: ' + err.message;
      },
    });
  }

  // Função para editar um colaborador
  editar(colaborador: Colaborador): void {
    // Preenche o formulário de edição com os dados do colaborador
    this.colaboradorEditando = { ...colaborador };
    this.colaboradorForm.patchValue(colaborador);

    // Exibe o modal para editar
    const modal = document.getElementById('modalEditar') as HTMLDialogElement;
    modal?.showModal();
  }

  // Função para salvar a edição do colaborador
  salvarEdicao(): void {
    if (this.colaboradorEditando && this.colaboradorForm.valid) {
      const atualizado = {
        ...this.colaboradorEditando,
        ...this.colaboradorForm.value,
      };

      // Chama o serviço para atualizar o colaborador
      this.colaboradorService.atualizar(atualizado.id, atualizado).subscribe({
        next: () => {
          this.carregarColaboradores();  // Recarrega a lista de colaboradores após a atualização
          this.fecharModal();  // Fecha o modal após salvar
        },
        error: (err) => {
          this.mensagemErro = 'Erro ao atualizar: ' + err.message;
        },
      });
    }
  }

  // Função para fechar o modal de edição
  fecharModal(): void {
    this.colaboradorEditando = null;
    const modal = document.getElementById('modalEditar') as HTMLDialogElement;
    modal?.close();  // Fecha o modal
  }
}
