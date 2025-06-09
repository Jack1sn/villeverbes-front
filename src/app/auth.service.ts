import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios, { AxiosHeaders } from 'axios';
import { Login } from './models/login';
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
  ];

  constructor(private router: Router) {
    this.configurarInterceptor();
    const user = this.getUser();
    if (user) {
      this.userRole = user.usuario.perfil;
    }
  }

  /**
   * ✅ Interceptor configurado com AxiosHeaders
   */
  private configurarInterceptor(): void {
    axios.interceptors.request.use((config) => {
      const token = this.getToken();

      const isPublic = this.rotasPublicas.some((rotaPublica) =>
        config.url?.includes(rotaPublica)
      );

      if (!isPublic && token && this.isAuthenticated()) {
        // Garante que headers seja instância de AxiosHeaders
        if (!(config.headers instanceof AxiosHeaders)) {
          config.headers = new AxiosHeaders(config.headers || {});
        }

        config.headers.set('Authorization', `Bearer ${token}`);
      }

      return config;
    });
  }

  /**
   * ✅ Login do usuário
   */
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

  /**
   * ✅ Logout
   */
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.userRole = null;
    this.router.navigate(['/login']);
  }

  /**
   * ✅ Armazena token e dados do usuário
   */
  private salvarDados(data: any): void {
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    this.userRole = data.usuario.perfil;
  }

  /**
   * ✅ Retorna o token JWT, se válido
   */
  getToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = this.decodeJwt(token);
        if (decoded?.exp && decoded.exp < Date.now() / 1000) {
          return null; // Token expirado
        }
        return token;
      } catch (e) {
        console.error('Token inválido:', e);
        return null;
      }
    }
    return null;
  }

  /**
   * ✅ Verifica se usuário está autenticado
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * ✅ Perfil do usuário (admin, user, etc.)
   */
  getRole(): string | null {
    return this.userRole;
  }

  /**
   * ✅ Objeto do usuário autenticado
   */
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

  /**
   * ⚠️ Tratamento de erros padrão
   */
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

  /**
   * ✅ Decodifica o JWT
   */
  private decodeJwt(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }
  /**
 * ✅ Verifica com o backend se há novas mensagens de ajuda
 */
async temNovaMensagem(): Promise<boolean> {
  try {
    const response = await axios.get(`${this.baseUrl}/ajuda/tem-nova-mensagem`);
    return response.data === true;
  } catch (error) {
    console.error('Erro ao verificar novas mensagens:', error);
    return false;
  }
}



}
