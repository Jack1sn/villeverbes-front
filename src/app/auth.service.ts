import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios, { AxiosError } from 'axios';
import { Login } from './models/login';
import { environment } from '../../src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRole: string | null = null;
  private baseUrl = environment.apiUrl;

  constructor(private router: Router) {
    const user = this.getUser();
    if (user) {
      this.userRole = user.perfil;
    }
  }

  /**
   * Realiza login com Axios ou com usuário temporário (teste).
   */
  async login(loginData: Login): Promise<void> {
    // ✅ 1. Verifica se é o usuário temporário
    if (
      loginData.email === 'usuario@gmail.com' &&
      loginData.senha === '123'
    ) {
      const usuarioTemporario = {
        nome: 'Usuário Temporário',
        email: loginData.email,
        perfil: 'TEMP' // Pode ser 'aluno', 'admin', etc., conforme seu sistema
      };
      localStorage.setItem('user', JSON.stringify(usuarioTemporario));
      this.userRole = usuarioTemporario.perfil;
      return;
    }

    // ✅ 2. Caso contrário, tenta login com servidor
    const url = `${this.baseUrl}/login`;

    try {
      const response = await axios.post(url, loginData, {
        withCredentials: true,
      });

      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        this.userRole = response.data.perfil;
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userRole = null;
    this.router.navigate(['/login']);
  }

  getRole(): string | null {
    return this.userRole;
  }

  isAuthenticated(): boolean {
    return this.userRole !== null;
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserName(): string | null {
    const user = this.getUser();
    return user ? user.nome : null;
  }

  private handleError(error: unknown): void {
    let errorMessage = 'Ocorreu um erro desconhecido';

    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'E-mail ou senha incorretos';
        } else if (error.response.status === 500) {
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else {
          errorMessage = error.response.data?.message || 'Erro desconhecido';
        }
      } else if (error.request) {
        errorMessage = 'Erro na requisição, sem resposta do servidor';
      }
    }

    console.error('Erro na requisição:', errorMessage);
    alert(errorMessage);
    throw new Error(errorMessage);
  }
}
