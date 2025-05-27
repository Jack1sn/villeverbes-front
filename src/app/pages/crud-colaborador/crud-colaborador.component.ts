import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColaboradorService } from '../../services/colaborador.service';
import { Colaborador } from '../../models/colaborador.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-crud-colaborador',
  standalone:true,
  templateUrl: './crud-colaborador.component.html',
  styleUrls: ['./crud-colaborador.component.css'],

  imports: [CommonModule, ReactiveFormsModule, HeaderComponent]
})
export class CrudColaboradorComponent implements OnInit {
  colaboradores: Colaborador[] = [];
  colaboradorForm!: FormGroup;
  editando: boolean = false;
  colaboradorSelecionadoId!: number;

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

  carregarColaboradores(): void {
    this.colaboradorService.listar().subscribe(res => this.colaboradores = res);
  }

  salvar(): void {
    if (this.editando) {
      this.colaboradorService.atualizar(this.colaboradorSelecionadoId, this.colaboradorForm.value).subscribe(() => {
        this.resetar();
        this.carregarColaboradores();
      });
    } else {
      this.colaboradorService.salvar(this.colaboradorForm.value).subscribe(() => {
        this.resetar();
        this.carregarColaboradores();
      });
    }
  }

  editar(colaborador: Colaborador): void {
    this.editando = true;
    this.colaboradorSelecionadoId = colaborador.id!;
    this.colaboradorForm.patchValue(colaborador);
  }

  excluir(id: number): void {
    this.colaboradorService.excluir(id).subscribe(() => this.carregarColaboradores());
  }

  resetar(): void {
    this.editando = false;
    this.colaboradorSelecionadoId = 0;
    this.colaboradorForm.reset();
  }
}
