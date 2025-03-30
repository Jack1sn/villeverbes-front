import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { Login } from './models/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userRole: string | null = null;
  private baseUrl = 'http://localhost:8080';

  constructor(private router: Router) {
    const user = this.getUser();
    if (user) {
      this.userRole = user.perfil;
    }
  }

  async login(loginData: Login): Promise<void> {
    const url = `${this.baseUrl}/login`;
    try {
      const response = await axios.post(url, loginData);
      const userData = response.data.usuario;
      this.userRole = userData.perfil;
      localStorage.setItem('user', JSON.stringify(userData));

      return response.data;
    } catch (error) {
      throw error;
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
}
