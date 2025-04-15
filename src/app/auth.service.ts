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
   * Realiza login com Axios e armazena usuário no localStorage.
   */
  async login(loginData: Login): Promise<void> {
    const url = `${this.baseUrl}/login`;

    try {
      const response = await axios.post(url, loginData, {
        withCredentials: true, // ✅ Permite envio/recebimento de cookies (JSESSIONID)
      });

      if (response.data) {
        // Armazenando os dados do usuário no localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        this.userRole = response.data.perfil;
      }
    } catch (error) {
      // Se ocorrer um erro, trata-o
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

  /**
   * Tratamento de erro com cast seguro para AxiosError.
   */
  private handleError(error: unknown): void {
    let errorMessage = 'Ocorreu um erro desconhecido';

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Verifique o código de status para fornecer mensagens específicas
        if (error.response.status === 401) {
          errorMessage = 'E-mail ou senha incorretos';
        } else if (error.response.status === 500) {
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        } else {
          errorMessage = error.response.data?.message || 'Erro desconhecido';
        }
      } else if (error.request) {
        // Se não houver resposta do servidor
        errorMessage = 'Erro na requisição, sem resposta do servidor';
      }
    }

    // Aqui você pode adicionar um feedback para o usuário, exibir um alerta ou logar o erro
    console.error('Erro na requisição:', errorMessage);
    alert(errorMessage); // Exemplo de como exibir uma mensagem para o usuário

    throw new Error(errorMessage);
  }
}
