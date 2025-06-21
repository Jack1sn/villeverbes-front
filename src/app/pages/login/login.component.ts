import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Login } from '../../models/login.model';
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
      // Chama o login e aguarda a resposta
      await this.authService.login(loginData);
      
      // Obtendo o papel do usuário
      const userRole = this.authService.getRole();

      // Obter os dados do usuário, incluindo o ID
      const usuario = this.authService.getUser();
      if (usuario) {
        // Salvar o ID do usuário no localStorage
        localStorage.setItem('usuarioId', usuario.usuario.id?.toString() || '');
        localStorage.setItem('usuario', JSON.stringify(usuario));  // Salva o objeto completo do usuário (em JSON)
        console.log('Usuário salvo no localStorage:', usuario);
         // Verifique se os dados estão salvos
     console.log('ID salvo no localStorage:', localStorage.getItem('usuarioId'));
     console.log('Usuário completo salvo no localStorage:', localStorage.getItem('usuario'));
    
      }

      this.successMessage = 'Login realizado com sucesso!';
      this.errorMessage = '';
  
      // ⏱ Espera 2 segundos para exibir a mensagem de sucesso
      setTimeout(() => {
        this.successMessage = '';
        this.mostrarLogin = false;
  
        // Redireciona de acordo com o papel do usuário
        if (userRole === 'COLABORADOR' || userRole === 'ADMIN') {
          this.router.navigate(['/home-admin']);
        } else if (userRole === 'JOGADOR') {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/login']);
        }
      }, 3000);
  
    } catch (error) {
      // Caso o login falhe, exibe mensagem de erro
      this.errorMessage = 'E-mail ou senha incorretos';
      this.successMessage = '';
  
      setTimeout(() => {
        this.errorMessage = '';  // Limpa a mensagem de erro após 3 segundos
      }, 3000);
    }
  }
  
  // Função para fechar o login
  fecharLogin() {
    this.mostrarLogin = false;
  }
}
