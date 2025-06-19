import { Injectable } from '@angular/core';
import axios from 'axios';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class JogadorService {
  private baseUrl = 'http://localhost:8080'; // URL base da API

  // Método para listar jogadores
  async listarJogadores(): Promise<Usuario[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/usuario/jogadores`);
      return response.data; // Retorna a lista de jogadores
    } catch (err) {
      console.error("Erro ao carregar jogadores:", err);
      throw new Error("Erro ao carregar jogadores.");
    }
  }

  // Método para alterar o status do jogador (ativo/inativo)
  async alterarStatusJogador(id: number, ativo: boolean): Promise<void> {
    try {
await axios.put(`${this.baseUrl}/usuario/jogadores/${id}/ativo?ativo=${ativo}`);
    } catch (err) {
      console.error("Erro ao alterar status do jogador:", err);
      throw new Error("Erro ao alterar status do jogador.");
    }
  }

  // Método de autocadastro de jogador
  async autoCadastro(jogador: Usuario): Promise<any> {
    const url = `${this.baseUrl}/jogador/autocadastro`;
    const response = await axios.post(url, jogador);
    return response.data;
  }
}
