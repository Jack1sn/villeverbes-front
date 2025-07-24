import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColaboradorService } from '../../services/colaborador.service';
import { Colaborador } from '../../models/colaborador.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-crud-colaborador',
  standalone: true,
  templateUrl: './crud-colaborador.component.html',
  styleUrls: ['./crud-colaborador.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, RouterLink]
})
export class CrudColaboradorComponent implements OnInit {
  colaboradores: Colaborador[] = [];
  colaboradorForm!: FormGroup;
  editando: boolean = false;
  colaboradorSelecionadoId!: number;

  mensagemSucesso: string = '';
  mensagemErro: string = '';

  constructor(
    private fb: FormBuilder,
    private colaboradorService: ColaboradorService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.carregarColaboradores(); 
  }

  initForm(): void {
    this.colaboradorForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      senha: ['', Validators.required],
    });
  }

  async salvar(): Promise<void> {
    this.mensagemSucesso = '';
    this.mensagemErro = '';

    if (this.colaboradorForm.invalid) {
      this.mensagemErro = 'Veuillez remplir correctement tous les champs, s´il vous plaît.';
      return;
    }

    try {
      if (this.editando) {
        await this.colaboradorService.atualizar(this.colaboradorSelecionadoId, this.colaboradorForm.value);
        this.mensagemSucesso = 'Colaborateur actualisé avec succès!';
      } else {
        const res = await this.colaboradorService.salvar(this.colaboradorForm.value);
        this.mensagemSucesso = res.message || 'Colaborateur enregistré avec succès!';
      }

      this.limparAutomaticamente();
      this.carregarColaboradores();
    } catch (err) {
      this.tratarErro(err);
    }
  }

  editar(colaborador: Colaborador): void {
    this.editando = true;
    this.colaboradorSelecionadoId = colaborador.id!;
    this.colaboradorForm.patchValue(colaborador);
    this.mensagemSucesso = '';
    this.mensagemErro = '';
  }

  async excluir(id: number): Promise<void> {
    this.mensagemSucesso = '';
    this.mensagemErro = '';

    try {
      await this.colaboradorService.excluir(id);
      this.mensagemSucesso = 'Colaborateur supprimé avec succès!';
      this.carregarColaboradores();
    } catch (err) {
      this.tratarErro(err);
    }
  }

  resetar(): void {
    this.editando = false;
    this.colaboradorSelecionadoId = 0;
    this.colaboradorForm.reset();
    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }

  limparAutomaticamente(): void {
    setTimeout(() => {
      this.resetar();
    }, 3000);
  }

  async carregarColaboradores(): Promise<void> {
    try {
      this.colaboradores = await this.colaboradorService.listar();
    } catch (err) {
      this.tratarErro(err);
    }
  }

  private tratarErro(err: any): void {
    if (err?.response?.data?.error) {
      this.mensagemErro = err.response.data.error;
    } else if (typeof err?.response?.data === 'string') {
      this.mensagemErro = err.response.data;  
    } else if (err.message) {
      this.mensagemErro = err.message;
    } else {
      this.mensagemErro = 'Erreur inattendue.';
    }

    console.error('Erreur:', err);
  }
}
