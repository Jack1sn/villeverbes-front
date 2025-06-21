import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class JogadorService {
  private baseUrl = 'http://localhost:8080'; // URL base da sua API

  constructor() {}

  /**
   * Lista todos os usuários com perfil de JOGADOR
   * @returns Promise<Usuario[]> Lista de jogadores
   */
  async listarJogadores(): Promise<Usuario[]> {
    try {
      const token = localStorage.getItem('token'); // se a API precisar de autenticação
      const response: AxiosResponse<Usuario[]> = await axios.get(`${this.baseUrl}/usuario/jogadores`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (err: any) {
      console.error("❌ Erro ao carregar jogadores:", err);
      throw new Error("Erro ao carregar jogadores.");
    }
  }

  /**
   * Altera o status (ativo/inativo) de um jogador
   * @param id ID do jogador
   * @param ativo Novo status booleano
   */
  async alterarStatusJogador(id: number, ativo: boolean): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${this.baseUrl}/usuario/jogadores/${id}/ativo?ativo=${ativo}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err: any) {
      console.error("❌ Erro ao alterar status do jogador:", err);
      throw new Error("Erro ao alterar status do jogador.");
    }
  }

  /**
   * Realiza o autocadastro de um novo jogador
   * @param jogador Objeto do tipo Usuario
   * @returns Dados de resposta da API (pode conter token ou mensagem)
   */
  async autoCadastro(jogador: Usuario): Promise<any> {
    try {
      const url = `${this.baseUrl}/jogador/autocadastro`;
      const response: AxiosResponse<any> = await axios.post(url, jogador, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (err: any) {
      console.error("❌ Erro no autocadastro:", err);
      if (err.response) {
        throw new Error(err.response.data?.mensagem || 'Erro no autocadastro.');
      }
      throw new Error("Erro inesperado no autocadastro.");
    }
  }

  /**
   * Busca um usuário pelo ID (pode ser usado para pegar nome ou dados completos)
   * @param id ID do usuário
   * @returns Objeto do tipo Usuario
   */
  async buscarUsuarioPorId(id: number): Promise<Usuario> {
    try {
      const token = localStorage.getItem('token');
      const response: AxiosResponse<Usuario> = await axios.get(`${this.baseUrl}/usuario/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (err: any) {
      console.error('❌ Erro ao buscar usuário por ID:', err);
      throw new Error("Erro ao buscar os dados do usuário.");
    }
  }
}
