import { Component, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AxiosError } from 'axios';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class LoginComponent {
  errorMessage: string = '';
  successMessage: string = '';
  
  email: string = '';
  senha: string = '';

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      const userData = this.authService.getUser();
      this.redirectUser(userData.perfil);
    }
  }


  async realizarLogin(content: any) {
    try {
      await this.authService.login({ email: this.email, senha: this.senha });
      const userData = this.authService.getUser();
      this.successMessage = 'Login realizado com sucesso!';
      this.errorMessage = '';
      this.modalService.open(content);

      setTimeout(() => {
        this.modalService.dismissAll();
        this.redirectUser(userData.perfil);
      }, 1000);
    } catch (error) {
      if ((error as AxiosError).status === 401) {
        this.errorMessage = 'E-mail ou senha incorretos';
      } else {
        this.errorMessage = 'Erro ao realizar o login. Tente novamente.';
      }
      this.successMessage = '';
      this.modalService.open(content);
    }
  }


  redirectUser(perfil: string) {
    switch (perfil) {
      case 'ADMIN':
      case 'FUNCIONARIO':   this.router.navigate(['/homefuncionario']);
        break;
      case 'JOGADOR':
        this.router.navigate(['/home']);
        break;
      default:
        this.router.navigate([' ']);
        break;
    }
  }


  openModal(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }
}
