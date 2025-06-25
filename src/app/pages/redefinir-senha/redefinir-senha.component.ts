import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { RedefinirSenhaService, RedefinirSenhaPayload } from '../../services/redefinir-senha.service';

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent]
})
export class RedefinirSenhaComponent {
  email: string = '';
  senhaAtual: string = '';
  novaSenha: string = '';
  confirmarSenha: string = '';
  erro: string = '';

  constructor(
    private redefinirSenhaService: RedefinirSenhaService,
    private router: Router
  ) {}

  redefinirSenha(): void {
    if (this.novaSenha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem.';
      return;
    }

    const payload: RedefinirSenhaPayload = {
      email: this.email,
      senhaAtual: this.senhaAtual,
      novaSenha: this.novaSenha
    };

    this.redefinirSenhaService.redefinirSenha(payload).subscribe({
      next: () => {
        alert('Senha redefinida com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.erro = err.error?.mensagem || 'Erro ao redefinir a senha.';
      }
    });
  }
}
