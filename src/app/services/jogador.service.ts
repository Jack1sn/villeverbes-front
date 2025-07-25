import { Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { Usuario } from '../models/usuario.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JogadorService {
  // ✅ Usa a URL da API conforme o ambiente (dev ou produção)
  private baseUrl = environment.apiUrl;

  constructor() {}

  /**
   * Lista todos os usuários com perfil de JOGADOR.
   * @returns Lista de jogadores.
   */
  async listarJogadores(): Promise<Usuario[]> {
    try {
      const token = localStorage.getItem('token');
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
   * Altera o status (ativo/inativo) de um jogador.
   * @param id ID do jogador.
   * @param actif Novo status booleano.
   */
  async alterarStatusJogador(id: number, actif: boolean): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${this.baseUrl}/usuario/jogadores/${id}/actif?actif=${actif}`, {}, {
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
   * Realiza o autocadastro de um novo jogador.
   * @param jogador Objeto com os dados do jogador.
   * @returns Resposta da API (ex: mensagem ou token).
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
        throw new Error(err.response.data?.mensagem || 'Erro ao realizar autocadastro.');
      }
      throw new Error("Erro inesperado ao realizar autocadastro.");
    }
  }

  /**
   * Busca um jogador pelo ID.
   * @param id ID do jogador.
   * @returns Objeto do tipo Usuario.
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
      console.error("❌ Erro ao buscar jogador por ID:", err);
      throw new Error("Erro ao buscar jogador.");
    }
  }
}
