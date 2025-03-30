import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, TemplateRef } from '@angular/core';
import { JogadorService } from '../../services/jogador.service';
import { Usuario } from '../../models/usuario';


@Component({
  selector: 'app-auto-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgxMaskDirective, NgxMaskPipe],
  providers: [provideNgxMask()],
  templateUrl: './auto-cadastro.component.html',
  styleUrls: ['./auto-cadastro.component.css']
})
export class AutoCadastroComponent {
  cadastroForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  JogadorService: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private jogadorService: JogadorService
  ) {
    this.cadastroForm = this.formBuilder.group({
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: ['', Validators.required],
        logradouro: [''],
        complemento: [''],
        bairro: [''],
        localidade: [''],
        uf: [''],
      }),
      telefone: ['', Validators.required],
    });
  }

  async buscarEndereco() {
    const cep = this.cadastroForm.get('endereco.cep')?.value;
    if (cep && cep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const data = response.data;
        if (!data.erro) {
          this.cadastroForm.patchValue({
            endereco: {
              logradouro: data.logradouro,
              complemento: data.complemento,
              bairro: data.bairro,
              localidade: data.localidade,
              uf: data.uf,
            }
          });
          this.errorMessage = '';
        } else {
          this.errorMessage = 'CEP não encontrado';
        }
      } catch (error) {
        this.errorMessage = 'Erro ao buscar CEP';
      }
    }
  }

  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }


  async cadastrar(content: any) {
    if (this.cadastroForm.valid) {
      const Jogador: Usuario = {
        nome: this.cadastroForm.get('nome')?.value,
        cpf: this.cadastroForm.get('cpf')?.value,
        telefone: this.cadastroForm.get('telefone')?.value,
        cep: this.cadastroForm.get('endereco.cep')?.value,
        endereco: this.cadastroForm.get('endereco.logradouro')?.value,
        numero: '',
        email: this.cadastroForm.get('email')?.value,
        perfil: "JOGADOR",
        complemento: this.cadastroForm.get('endereco.complemento')?.value,
        bairro: this.cadastroForm.get('endereco.bairro')?.value,
        cidade: this.cadastroForm.get('endereco.localidade')?.value,
        estado: this.cadastroForm.get('endereco.uf')?.value,
      };

      try {
        const response = await this.JogadorService.autoCadastro(Jogador);
        this.successMessage = 'Cadastro realizado com sucesso!';
        this.errorMessage = '';
        this.modalService.open(content);
        setTimeout(() => {
          this.modalService.dismissAll();
          this.router.navigate(['/login']); 
        }, 2000);
      } catch (error) {
        this.errorMessage = 'Erro ao realizar o cadastro. Tente novamente.';
        this.successMessage = '';
        this.modalService.open(content);
      }
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      this.successMessage = '';
      this.modalService.open(content);
    }
  }



}