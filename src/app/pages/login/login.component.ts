import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Login } from '../../models/login';
import { HeaderComponent } from '../header/header.component';

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
  mostrarLogin: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  async realizarLogin(form: any) {
    if (form.invalid) {
      this.errorMessage = 'Preencha todos os campos corretamente.';
      return;
    }
  
    const loginData: Login = {
      email: this.email,
      senha: this.senha,
    };
  
    try {
      await this.authService.login(loginData);
      const userRole = this.authService.getRole();
  
      this.successMessage = 'Login realizado com sucesso!';
      this.errorMessage = '';
  
      // ⏱ Espera 2 segundos para exibir a mensagem de sucesso
      setTimeout(() => {
        this.successMessage = '';
        this.mostrarLogin = false;
  
        // 🔀 Redireciona depois que a mensagem sumir
        if (userRole === 'COLABORADOR' || userRole === 'ADMIN') {
          this.router.navigate(['/home-admin']);
        } else if (userRole === 'JOGADOR') {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/login']);
        }
      }, 3000);
  
    } catch (error) {
      this.errorMessage = 'E-mail ou senha incorretos';
      this.successMessage = '';
  
      setTimeout(() => {
        this.errorMessage = '';
      }, 3000);
    }
  }
  
  

  fecharLogin() {
    this.mostrarLogin = false;
  }
}
