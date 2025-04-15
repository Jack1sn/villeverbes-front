
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Para usar ngModel
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth.service'; // Corrigido o caminho do AuthService
import { Login } from '../../models/login'; // Corrigido o caminho para o modelo de login

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule ], // Importando módulos necessários
  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corrigido styleUrls para ficar correto com Angular
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  errorMessage: string = ' Erro ao ...';
  successMessage: string = 'Sucesso...';

  constructor(private authService: AuthService, private router: Router) {}

  // Método de login
  async realizarLogin( ) {
    const loginData: Login = {
      email: this.email,
      senha: this.senha
    };

    try {
      await this.authService.login(loginData);
      this.successMessage = 'Login realizado com sucesso!';
      this.errorMessage = '';
      setTimeout(() => {
        this.router.navigate(['/home']); // Ajuste o caminho da sua rota para onde deseja ir após o login
      }, 1000);
    } catch (error) {
      this.errorMessage = 'E-mail ou senha incorretos';
      this.successMessage = '';
    }
  }
}
