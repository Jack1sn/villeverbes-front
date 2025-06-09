import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-tela-inicial',
  standalone: true,
  templateUrl: './tela-inicial.component.html',
  styleUrls: ['./tela-inicial.component.css'],
  imports: [HeaderComponent, FormsModule, CommonModule]
})
export class TelaInicialComponent {
  mostrarAjuda = false;
  mostrarInformacao = false;
  mostrarGepta = false;

  emailRemetente = '';
  mensagemAjuda = '';

  sucesso: boolean = false;
  erro: boolean = false;
  enviandoMensagem: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  login(): void {
    this.router.navigate(['/login']);
  }

  startGame(): void {
    this.router.navigate(['/game']);
  }

  goToGEPTA(): void {
    window.open('https://gepta.weebly.com/', '_blank');
  }

 enviarAjuda(form: NgForm): void {
  if (form.invalid) return;

  this.sucesso = false;
  this.erro = false;
  this.enviandoMensagem = true;

  const params = new HttpParams()
    .set('para', 'villedesverbes@gmail.com')
    .set('assunto', 'Pedido de ajuda.')
    .set('texto', `Email do remetente: ${this.emailRemetente}\n\nMensagem:\n${this.mensagemAjuda}`);

  this.http.post('http://localhost:8080/email/simples', null, {
    params,
    responseType: 'text'
  }).subscribe({
    next: () => {
      this.enviandoMensagem = false;
      this.sucesso = true;
      this.erro = false;

      // Não reseta logo, para não apagar o conteúdo antes da mensagem ser vista
      setTimeout(() => {
        this.emailRemetente = '';
        this.mensagemAjuda = '';
        form.resetForm();

        this.sucesso = false;
        this.mostrarAjuda = false;
      }, 2500); // tempo suficiente para o usuário ver a mensagem
    },
    error: (err) => {
      console.error('Erro ao enviar mensagem:', err);
      this.erro = true;
      this.sucesso = false;
      this.enviandoMensagem = false;
    }
  });
}

}
