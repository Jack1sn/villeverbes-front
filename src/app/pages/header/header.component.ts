import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  standalone:true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports:[ RouterModule, CommonModule]
})
export class HeaderComponent implements OnInit {
  userName: string | null = null;
  userRole: string | null = null;
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuthenticationStatus();
  }

  /**
   * Verifica se o usuário está autenticado e atualiza o nome e o perfil.
   */
  checkAuthenticationStatus(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.userName = this.authService.getUserName();
      this.userRole = this.authService.getRole();
    } else {
      this.userName = null;
      this.userRole = null;
    }
  }

  /**
   * Método para o logout do usuário.
   */
  logout(): void {
    this.authService.logout(); // Chama o logout no AuthService
    this.checkAuthenticationStatus(); // Atualiza o status de autenticação
    this.router.navigate(['/login']); // Redireciona para a página de login
  }

  /**
   * Obtém o link correto para o Home dependendo do perfil do usuário.
   */
  getHomeLink(): string {
    if (this.userRole === 'ADMIN') {
      return '/home-admin'; // Admin
    } else if (this.userRole === 'JOGADOR') {
      return '/home'; // Jogador
    }
    return '/'; // Caso não tenha perfil ou não esteja autenticado
  }

  /**
   * Obtém o link do Ranking dependendo do perfil do usuário.
   */
  getRankingLink(): string {
    if (this.userRole === 'ADMIN') {
      return '/visualizar-ranking'; // Admin
    } else if (this.userRole === 'JOGADOR') {
      return `/ranking/${this.authService.getUserId()}`; // Jogador
    }
    return '/';
  }

  /**
   * Obtém o link para os Troféus dependendo do perfil do usuário.
   */
  getTropheeLink(): string {
    if (this.userRole === 'ADMIN') {
      return '/trophee'; // Admin
    } else if (this.userRole === 'JOGADOR') {
      return `/trophee/${this.authService.getUserId()}`; // Jogador
    }
    return '/';
  }

  /**
   * Obtém o link para as configurações dependendo do perfil do usuário.
   */
  getConfigurationLink(): string {
    if (this.userRole === 'ADMIN') {
      return '/crudAmbiente'; // Admin
    } else if (this.userRole === 'JOGADOR') {
      return '/config-jogador'; // Jogador
    }
    return '/';
  }
}
