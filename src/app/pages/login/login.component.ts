import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Login } from '../../models/login';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  senha: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async realizarLogin() {
    const loginData: Login = {
      email: this.email,
      senha: this.senha
    };

    try {
      // Fazendo login e obtendo os dados do usuário
      await this.authService.login(loginData);

      // Após login bem-sucedido, verifica o perfil do usuário
      const userRole = this.authService.getRole(); // Verifique o perfil do usuário

      this.successMessage = 'Login realizado com sucesso!';
      this.errorMessage = '';

      // Redireciona para a rota correspondente ao perfil do usuário
      if (userRole === 'SUPERADMIN' || userRole === 'ADMIN') {
        this.router.navigate(['/home-admin']);
      } else if (userRole === 'JOGADOR') {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }

    } catch (error) {
      // Captura erro e exibe mensagem de erro
      console.error('Erro ao fazer login', error);
      this.errorMessage = 'E-mail ou senha incorretos';
      this.successMessage = '';
    }
  }
}
