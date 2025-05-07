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
    const user = this.getUser();
    if (user) {
      this.userRole = user.perfil;
    }
  }

  /**
   * Realiza o cadastro de um novo usuário (autocadastro).
   */
  async autoCadastro(usuarioData: any): Promise<void> {
    const url = `${this.baseUrl}/jogador/autocadastro`;  // Endpoint do autocadastro

    try {
      const response = await axios.post(url, usuarioData);

      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));  // Salva os dados do usuário no localStorage
        this.userRole = response.data.perfil;
        this.router.navigate(['/login']);  // Redireciona para a página inicial após o cadastro
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Realiza o login de um usuário existente.
   */
  async login(loginData: Login): Promise<void> {
    const url = `${this.baseUrl}/login`;  // Endpoint do login

    try {
      const response = await axios.post(url, loginData, {
        withCredentials: true,  // Adicione se for necessário enviar cookies/autenticação
      });

      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));  // Salva os dados do usuário no localStorage
        this.userRole = response.data.perfil;
        this.router.navigate(['/home']);  // Redireciona para a página inicial após o login
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Faz o logout do usuário.
   */
  logout(): void {
    localStorage.removeItem('user');
    this.userRole = null;
    this.router.navigate(['/login']);  // Redireciona para a página de login após o logout
  }

  /**
   * Obtém o papel (role) do usuário.
   */
  getRole(): string | null {
    return this.userRole;
  }

  /**
   * Verifica se o usuário está autenticado.
   */
  isAuthenticated(): boolean {
    return this.userRole !== null;
  }

  /**
   * Obtém os dados do usuário do localStorage.
   */
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Obtém o nome do usuário.
   */
  getUserName(): string | null {
    const user = this.getUser();
    return user ? user.nome : null;
  }

  /**
   * Trata os erros na requisição HTTP.
   */
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
    alert(errorMessage);  // Exibe o erro ao usuário
    throw new Error(errorMessage);  // Lança um erro para interromper a execução
  }
}
