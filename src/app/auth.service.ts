import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { Login } from './models/login';
import { environment } from '../../src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRole: string | null = null;
  private baseUrl = environment.apiUrl;

  constructor(private router: Router) {
    this.configurarInterceptor();
    const user = this.getUser();
    if (user) {
      this.userRole = user.usuario.perfil;
    }
  }

  /**
   * 🔐 Adiciona token JWT nas requisições Axios
   */
  private configurarInterceptor(): void {
    axios.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * ✅ Login via API real
   */
  async login(loginData: Login): Promise<void> {
    const url = `${this.baseUrl}/auth/login`;  // URL para o login na API real

    try {
      const response = await axios.post(url, loginData);  // Envia as credenciais para a API

      // Verifica se o token foi recebido
      if (response.data && response.data.token) {
        this.salvarDados(response.data);  // Armazena os dados (token e informações do usuário)
        this.router.navigate(['/home']);  // Redireciona para a tela inicial
      } else {
        throw new Error('Token JWT não recebido.');
      }
    } catch (error) {
      this.handleError(error);  // Lida com possíveis erros
    }
  }

  /**
   * ✅ Encerra a sessão e volta para o login
   */
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.userRole = null;
    this.router.navigate(['/login']);  // Redireciona para a tela de login
  }

  /**
   * ✅ Armazena token e dados do usuário localmente
   */
  private salvarDados(data: any): void {
    localStorage.setItem('user', JSON.stringify(data));  // Armazena os dados do usuário
    localStorage.setItem('token', data.token);  // Armazena o token JWT
    this.userRole = data.usuario.perfil;  // Define o perfil do usuário (ADMIN, JOGADOR, etc)
  }

  /**
   * ✅ Retorna o token salvo
   */
  getToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = this.decodeJwt(token);
        if (decoded?.exp && decoded.exp < Date.now() / 1000) {
          // Apenas retorna null, não faz logout
          return null;
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
   * ✅ Retorna se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;  // Verifica se o token está presente e válido
  }

  /**
   * ✅ Retorna o perfil (ADMIN, JOGADOR, etc)
   */
  getRole(): string | null {
    return this.userRole;  // Retorna o perfil do usuário
  }

  /**
   * ✅ Retorna objeto completo do usuário
   */
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;  // Retorna o objeto do usuário completo
  }

  /**
   * ✅ Retorna apenas o nome do usuário
   */
  getUserName(): string | null {
    const user = this.getUser();
    return user ? user.usuario.nome : null;  // Retorna o nome do usuário
  }

  /**
   * ✅ Retorna o ID do usuário
   */
  getUserId(): string | null {
    const user = this.getUser();
    return user ? user.usuario.id : null;  // Retorna o ID do usuário, se existir
  }

  /**
   * ⚠️ Exibe erro amigável
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
        errorMessage = error.message || 'Erro desconhecido';
      }
    }

    console.error('Erro:', errorMessage);
    alert(errorMessage);  // Exibe mensagem de erro
    throw new Error(errorMessage);  // Lança o erro para tratamento adicional
  }

  /**
   * Decode o token JWT
   */
  private decodeJwt(token: string): any {
    const payload = token.split('.')[1];  // Extrai a parte do payload do JWT
    return JSON.parse(atob(payload));  // Decodifica o payload do JWT
  }
}
