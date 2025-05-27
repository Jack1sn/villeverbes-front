import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
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
  emailRemetente = '';
  mensagemAjuda = '';
  sucesso = false;
  erro = false;

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
    if (!form.valid) return;

    this.sucesso = false;
    this.erro = false;

    const params = new HttpParams()
      .set('para', 'villedesverbes@gmail.com')
      .set('assunto', 'Pedido de ajuda.')
      .set('texto', `Email do remetente: ${this.emailRemetente}\n\nMensagem:\n${this.mensagemAjuda}`);

    this.http.post('http://localhost:8080/email/simples', null, {
      params,
      responseType: 'text'
    }).subscribe({
      next: ( resposta) => {

        console.log('Resposta do servidor:', resposta);
        this.sucesso = true;
        this.erro = false;
        this.emailRemetente = '';
        this.mensagemAjuda = '';
        form.resetForm();
        
        setTimeout(() => {
          this.mostrarAjuda = false;
          this.sucesso = false;
         
        }, 3000);
      },
      error: (err) => {
        console.error('Erro ao enviar mensagem:', err);
        this.erro = true;
      }
    });
  }

  mostrarInformacao = false;
  mostrarGepta = false;

}


