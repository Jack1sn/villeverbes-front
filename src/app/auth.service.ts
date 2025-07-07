import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios, { AxiosHeaders } from 'axios';
import { Login } from './models/login.model';
import { environment } from '../../src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRole: string | null = null;
  private baseUrl = environment.apiUrl;

  private rotasPublicas = [
    '/auth/login',
    '/auth/enviar-senha',
    '/jogador/autocadastro',
    '/email/simples',
    '/ajuda-emails',
    '/api/pronomes',
    '/api/verbos',
    '/api/tempos',
    '/api/complementos',
    '/api/jogo/',
    '/api/jogo/{usuarioId}',
    '/api/jogo/{usuarioId}/{id}',
  ];

  constructor(private router: Router) {
    this.configurarInterceptor();
    const user = this.getUser();
    if (user) {
      this.userRole = user.usuario.perfil;
    }
  }

  private configurarInterceptor(): void {
    axios.interceptors.request.use((config) => {
      const token = this.getToken();

      const isPublic = this.rotasPublicas.some((rotaPublica) =>
        config.url?.includes(rotaPublica)
      );

      if (!isPublic && token && this.isAuthenticated()) {
        if (!(config.headers instanceof AxiosHeaders)) {
          config.headers = new AxiosHeaders(config.headers || {});
        }
        config.headers.set('Authorization', `Bearer ${token}`);
      }

      return config;
    });
  }

  async login(loginData: Login): Promise<void> {
    const url = `${this.baseUrl}/auth/login`;

    try {
      const response = await axios.post(url, loginData);

      if (response.data?.token) {
        this.salvarDados(response.data);
        this.router.navigate(['/home']);
      } else {
        throw new Error('Token JWT não recebido.');
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.userRole = null;
    this.router.navigate(['/login']);
  }

  private salvarDados(data: any): void {
    // Salvando no localStorage
    localStorage.setItem('user', JSON.stringify(data));  // Salvando os dados do usuário
    localStorage.setItem('token', data.token);  // Salvando o token

    // Salvando o perfil do usuário
    this.userRole = data.usuario.perfil;

    // Salvando o id do usuário, se necessário
    if (data.usuario && data.usuario.id) {
      localStorage.setItem('usuarioId', data.usuario.id.toString());
    }
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = this.decodeJwt(token);
      if (decoded?.exp && decoded.exp < Date.now() / 1000) {
        return null; // Token expirado
      }
      return token;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getRole(): string | null {
    return this.userRole;
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserName(): string | null {
    return this.getUser()?.usuario?.nome ?? null;
  }

  getUserId(): string | null {
    return this.getUser()?.usuario?.id ?? null;
  }

  private handleError(error: unknown): void {
    let errorMessage = 'Ocorreu um erro desconhecido';
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'E-mail ou senha incorretos.';
            break;
          case 500:
            errorMessage = 'Erro interno do servidor.';
            break;
          default:
            errorMessage = error.response.data?.message || 'Erro desconhecido.';
        }
      } else if (error.request) {
        errorMessage = 'Servidor não respondeu.';
      } else {
        errorMessage = error.message;
      }
    }
    console.error('Erro:', errorMessage);
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  private decodeJwt(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Erro ao decodificar JWT:', error);
      return null;
    }
  }

  async temNovaMensagem(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/ajuda/tem-nova-mensagem`);
      return response.data === true;
    } catch (error) {
      console.error('Erro ao verificar novas mensagens:', error);
      return false;
    }
  }
isAdmin(): boolean {
  return this.getRole() === 'ADMIN';
}

isJogador(): boolean {
  return this.getRole() === 'JOGADOR';
}



}
