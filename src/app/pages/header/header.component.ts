import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  role: string | null = null;
  userId: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    // Obtendo o role e userId do serviço de autenticação
    this.role = this.authService.getRole();
    this.userId = this.authService.getUserId();
  }

  // Método para gerar o link da página Home, dependendo do papel do usuário (admin ou jogador)
  getHomeLink(): string {
    if (this.role === 'ADMIN') {
      return '/home-admin'; // Admin acessa a página de home específica do admin
    } else if (this.role === 'JOGADOR') {
      return '/home'; // Jogador acessa a página de home padrão
    }
    return '/'; // Caso não haja role, redireciona para a página inicial
  }

  // Método para gerar o link do ranking, dependendo do papel do usuário (admin ou jogador)
  getRankingLink(): string {
    if (this.role === 'ADMIN') {
      return `/visualizar-ranking`; // Admin acessa a visualização de ranking sem ID de usuário
    } else if (this.role === 'JOGADOR' && this.userId) {
      return `/ranking/${this.userId}`; // Jogador acessa o ranking com o seu ID
    }
    return '/'; // Caso não haja role, redireciona para a página inicial
  }

  // Método para gerar o link do troféu, dependendo do papel do usuário (admin ou jogador)
  getTropheeLink(): string {
    if (this.role === 'ADMIN') {
      return '/trophee'; // Admin acessa a página de troféus geral
    } else if (this.role === 'JOGADOR' && this.userId) {
      return `/trophee/${this.userId}`; // Jogador acessa a página de troféus com seu ID
    }
    return '/'; // Caso não haja role, redireciona para a página inicial
  }

  // Método para gerar o link de configuração, dependendo do papel do usuário (admin ou jogador)
  getConfigurationLink(): string {
    if (this.role === 'ADMIN') {
      return '/crudAmbiente';  // Admin acessa a página de configuração de ambientes
    } else if (this.role === 'JOGADOR') {
      return '/config-jogador';  // Jogador acessa a página de configuração personalizada
    }
    return '/';  // Retorna o caminho raiz caso não tenha um perfil definido
  }

  // Método de logout que chama o AuthService e redireciona para a página de login
  logout(): void {
    this.authService.logout(); // Chama o método de logout do AuthService
    this.router.navigate(['/login']); // Redireciona para a página de login
  }
}
