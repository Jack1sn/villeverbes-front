import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { interval } from 'rxjs';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [RouterModule, CommonModule]
})
export class HeaderComponent implements OnInit {
  userName: string | null = null;
  userRole: string | null = null;
  isAuthenticated: boolean = false;
  temNovaMensagem: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuthenticationStatus();

    if (this.isAuthenticated && this.isAdmin()) {
      this.verificarNovasMensagens();

      // Verifica a cada 60 segundos
      interval(60000).subscribe(() => this.verificarNovasMensagens());
    }
  }

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

  logout(): void {
    this.authService.logout();
    this.checkAuthenticationStatus();
    this.router.navigate(['/login']);
  }

  getHomeLink(): string {
    if (this.userRole === 'ADMIN') return '/home-admin';
    if (this.userRole === 'JOGADOR') return '/home';
    return '/';
  }

  getRankingLink(): string {
    if (this.userRole === 'ADMIN') return '/visualizar-ranking';
    if (this.userRole === 'JOGADOR') return `/ranking/${this.authService.getUserId()}`;
    return '/';
  }

  getTropheeLink(): string {
    if (this.userRole === 'ADMIN') return '/trophee';
    if (this.userRole === 'JOGADOR') return `/trophee/${this.authService.getUserId()}`;
    return '/';
  }

  getConfigurationLink(): string {
    if (this.userRole === 'ADMIN') return '/crudAmbiente';
    if (this.userRole === 'JOGADOR') return '/redefinir-senha';
    return '/';
  }

  getAjudaLink(): string | null {
    if (this.userRole === 'ADMIN') return '/ajuda';
    return null;
  }

  //getColaboradorLink(): string | null {
  //  if (this.userRole === 'ADMIN') return '/crud-colaborador';
    //if (this.userRole === 'COLABORADOR') return '/home-admin';
  //  return null;
 // }

  getJogadorLink(): string | null {
    if (this.userRole === 'ADMIN') return '/visualizar-jogadores';
    if (this.userRole === 'COLABORADOR') return '/home-admin';
    return null;
  }

  isAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }

  /**
   * Verifica se há novas mensagens no backend e ativa badge de notificação.
   */
 verificarNovasMensagens(): void {
  this.authService.temNovaMensagem().then((tem) => {
    this.temNovaMensagem = tem;
  }).catch((err) => {
    console.error('Erro ao verificar novas mensagens:', err);
    this.temNovaMensagem = false;
  });
}

}
