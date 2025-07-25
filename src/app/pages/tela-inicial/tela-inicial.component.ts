import { Component } from '@angular/core'; 
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http'; 
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';  // Importar environment

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

  private apiBaseUrl = environment.apiUrl;  // Base URL da API

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

    const ajudaPayload = {
      remetente: this.emailRemetente.trim(),
      mensagem: this.mensagemAjuda.trim()
    };

    const params = new HttpParams()
      .set('para', 'villedesverbes@gmail.com')
      .set('assunto', 'Pedido de ajuda.')
      .set('texto', `Email do remetente: ${this.emailRemetente}\n\nMensagem:\n${this.mensagemAjuda}`);

    const reqSimples = this.http.post(`${this.apiBaseUrl}/email/simples`, null, {
      params,
      responseType: 'text'
    }).pipe(
      catchError(err => {
        console.error('[email/simples] erro:', err);
        return of(null);
      })
    );

    const reqAjuda = this.http.post(`${this.apiBaseUrl}/ajuda`, ajudaPayload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(err => {
        console.error('[ajuda] erro:', err);
        return of(null);
      })
    );

    forkJoin([reqSimples, reqAjuda]).subscribe(([resSimples, resAjuda]) => {
      this.enviandoMensagem = false;

      if (resSimples !== null || resAjuda !== null) {
        this.sucesso = true;
        this.erro = false;

        setTimeout(() => {
          this.emailRemetente = '';
          this.mensagemAjuda = '';
          form.resetForm();
          this.sucesso = false;
          this.mostrarAjuda = false;
        }, 2500);
      } else {
        this.sucesso = false;
        this.erro = true;
      }
    });
  }
}
