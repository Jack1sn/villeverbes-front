import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColaboradorService } from '../../services/colaborador.service';
import { Colaborador } from '../../models/colaborador.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-crud-colaborador',
  standalone: true,
  templateUrl: './crud-colaborador.component.html',
  styleUrls: ['./crud-colaborador.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, RouterLink ]
})
export class CrudColaboradorComponent implements OnInit {
  colaboradores: Colaborador[] = []; // Inicia com um array vazio (sem colaboradores cadastrados)
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
  }

  initForm(): void {
    this.colaboradorForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      senha: ['', Validators.required],
    });
  }

  salvar(): void {
    this.mensagemSucesso = '';
    this.mensagemErro = '';

    if (this.colaboradorForm.invalid) {
      this.mensagemErro = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    if (this.editando) {
      this.colaboradorService.atualizar(this.colaboradorSelecionadoId, this.colaboradorForm.value)
        .subscribe({
          next: () => {
            this.mensagemSucesso = 'Colaborador atualizado com sucesso!';
            this.limparAutomaticamente();
            this.carregarColaboradores();
          },
          error: (err) => this.tratarErro(err)
        });
    } else {
      this.colaboradorService.salvar(this.colaboradorForm.value)
        .subscribe({
          next: (res: any) => {
            this.mensagemSucesso = res.message || 'Colaborador cadastrado com sucesso!';
            this.limparAutomaticamente();
            this.carregarColaboradores();
          },
          error: (err) => this.tratarErro(err)
        });
    }
  }

  editar(colaborador: Colaborador): void {
    this.editando = true;
    this.colaboradorSelecionadoId = colaborador.id!;
    this.colaboradorForm.patchValue(colaborador);
    this.mensagemSucesso = '';
    this.mensagemErro = '';
  }

  excluir(id: number): void {
    this.mensagemSucesso = '';
    this.mensagemErro = '';

    this.colaboradorService.excluir(id).subscribe({
      next: () => {
        this.mensagemSucesso = 'Colaborador excluído com sucesso!';
        this.carregarColaboradores();
      },
      error: (err) => this.tratarErro(err)
    });
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
    }, 3000); // Limpa o formulário e mensagens após 3 segundos
  }

  carregarColaboradores(): void {
    this.colaboradorService.listar().subscribe({
      next: (res) => this.colaboradores = res, // Atualiza a lista de colaboradores
      error: (err) => this.tratarErro(err)
    });
  }

  private tratarErro(err: any): void {
    if (err.error && err.error.error) {
      this.mensagemErro = err.error.error;
    } else if (err.error && typeof err.error === 'string') {
      this.mensagemErro = err.error;
    } else if (err.message) {
      this.mensagemErro = err.message;
    } else {
      this.mensagemErro = 'Ocorreu um erro inesperado.';
    }
  }
}
