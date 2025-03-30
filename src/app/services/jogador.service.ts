import { Injectable } from '@angular/core';
import axios from 'axios';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class JogadorService {
  private baseUrl = 'http://localhost:8080';

  constructor() {}

  async autoCadastro(Jogador: Usuario): Promise<any> {
    const url = `${this.baseUrl}/jogador/autocadastro`;
    try {
      const response = await axios.post(url, Jogador);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}