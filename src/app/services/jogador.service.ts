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
      console.error("❌ Erreur lors du chargement des joueurs :", err);
      throw new Error("Erreur lors du chargement des joueurs.");
    }
  }

  /**
   * Altera o status (ativo/inativo) de um jogador
   * @param id ID do jogador
   * @param actif Novo status booleano
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
      console.error("❌ Erreur lors de la modification du statut du joueur:", err);
      throw new Error("Erreur lors de la modification du statut du joueur.");
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
      console.error("❌ Erreur lors de l'auto-inscription:", err);
      if (err.response) {
        throw new Error(err.response.data?.mensagem || 'Erreur lors de l´auto-inscription.');
      }
      throw new Error("Erreur inattendue lors de l'auto-inscription.");
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
      console.error('❌ Erreur lors de la recherche de l’utilisateur par ID :', err);
      throw new Error("Erreur lors de la récupération des données de l’utilisateur.");
    }
  }
}
