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
   * 🔐 Adiciona token JWT (falso ou real) nas requisições Axios
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
   * ✅ Login com simulação de usuários locais
   */
  async login(loginData: Login): Promise<void> {
    const usarLoginSimulado = true; // Altere para false ao usar backend real

    if (usarLoginSimulado) {
      // 👤 Lista de usuários fictícios
      const usuariosFicticios = [
        {
          email: 'admin@email.com',
          senha: '123',
          perfil: 'ADMIN',
          nome: 'Admin Simulado',
          id: '1',
        },
        {
          email: 'jogador@email.com',
          senha: '123',
          perfil: 'JOGADOR',
          nome: 'Jogador Simulado',
          id: '2',
        },
        {
          email: 'superadmin@email.com',
          senha: '123',
          perfil: 'SUPERADMIN',
          nome: 'Superadmin Simulado',
          id: '3',
        },
      ];

      // 🔍 Verifica se existe o usuário
      const usuario = usuariosFicticios.find(
        (u) => u.email === loginData.email && u.senha === loginData.senha
      );

      if (!usuario) {
        alert('E-mail ou senha incorretos.');
        return;
      }

      // 🧪 Simula resposta do backend
      const dadosSimulados = {
        token: 'token-falso-simulacao',
        usuario: {
          nome: usuario.nome,
          perfil: usuario.perfil,
          id: usuario.id, // ID do usuário
        },
      };

      // 💾 Salva e redireciona conforme o perfil
      this.salvarDados(dadosSimulados);

      switch (usuario.perfil) {
        case 'SUPERADMIN':
          this.router.navigate(['/home-admins']);
          break;
        case 'ADMIN':
          this.router.navigate(['/crudAbiente']);
          break;
        case 'JOGADOR':
        default:
          this.router.navigate(['/home']);
      }

      return;
    }

    // 🌐 Login real via API (use quando backend estiver pronto)
    /*
    const url = `${this.baseUrl}/login`;

    try {
      const response = await axios.post(url, loginData);
      if (response.data && response.data.token) {
        this.salvarDados(response.data);
        this.router.navigate(['/home']);
      } else {
        throw new Error('Token JWT não recebido.');
      }
    } catch (error) {
      this.handleError(error);
    }
    */
  }

  /**
   * ✅ Encerra a sessão e volta para o login
   */
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.userRole = null;
    this.router.navigate(['/login']);
  }

  /**
   * ✅ Armazena token e dados do usuário localmente
   */
  private salvarDados(data: any): void {
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('token', data.token);
    this.userRole = data.usuario.perfil;
  }

  /**
   * ✅ Retorna o token salvo
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * ✅ Retorna se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * ✅ Retorna o perfil (ADMIN, JOGADOR, etc)
   */
  getRole(): string | null {
    return this.userRole;
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
    return user ? user.usuario.nome : null;
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
      }
    }

    console.error('Erro:', errorMessage);
    alert(errorMessage);
    throw new Error(errorMessage);
  }
}
