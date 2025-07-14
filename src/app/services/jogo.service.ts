import { Injectable } from '@angular/core';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { JogoData } from '../models/jogo-data.model';

export interface Frase {
  frase: string;
  respostaCorreta: string;
}

@Injectable({
  providedIn: 'root',
})
export class JogoService {
  private apiUrl = 'http://localhost:8080/api/jogos';     // Para salvar resultados
  private frasesUrl = 'http://localhost:8080/api/frases'; // Para buscar todas as frases

  constructor() {}

  /**
   * Salva o resultado do jogo no backend
   */
  salvarResultadoJogo(usuarioId: number, jogoData: JogoData): Promise<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token de autenticação não encontrado no localStorage.');
      return Promise.reject('Token ausente');
    }

    localStorage.setItem('ultimoResultadoJogo', JSON.stringify(jogoData));

    return axios
      .post(`${this.apiUrl}/${usuarioId}`, jogoData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response: AxiosResponse) => {
        console.log('✅ Dados salvos com sucesso:', response.data);
        return response.data;
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          console.error('❌ Erro da API:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('❌ Erro na requisição:', error.request);
        } else {
          console.error('❌ Erro desconhecido:', error.message);
        }
        throw error;
      });
  }

  /**
   * Busca todas as frases do backend (compartilhadas entre ambientes)
   */
  async getTodasFrases(): Promise<Frase[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }

    try {
      const response = await axios.get<Frase[]>(this.frasesUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar frases do backend:', error);
      throw error;
    }
  }

  /**
   * Retorna as frases específicas de um ambiente (casa, parque, universidade)
   */
  async getFrasesPorAmbiente(ambiente: 'casa' | 'parque' | 'universidade'): Promise<Frase[]> {
    const todasFrases = await this.getTodasFrases();

    switch (ambiente) {
      case 'casa':
        return todasFrases.slice(0, 21);     // 11 perguntas * 2 frases
      case 'parque':
        return todasFrases.slice(22, 43);
      case 'universidade':
        return todasFrases.slice(44, 65);
      default:
        throw new Error(`Ambiente inválido: ${ambiente}`);
    }
  }

  /**
   * Verifica se a resposta do usuário está correta
   */
  verificarRespostaDigitada(resposta: string, correta: string): boolean {
    return resposta.trim().toLowerCase() === correta.trim().toLowerCase();
  }

    /**
   * Salva todos os resultados acumulados de uma vez no backend
   */
  salvarResultadosDeTodosOsJogos(usuarioId: number, resultados: JogoData[]): Promise<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token de autenticação não encontrado no localStorage.');
      return Promise.reject('Token ausente');
    }

    return axios
      .post(`${this.apiUrl}/${usuarioId}/todos`, resultados, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response: AxiosResponse) => {
        console.log('✅ Todos os resultados salvos com sucesso:', response.data);
        return response.data;
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          console.error('❌ Erro da API ao salvar múltiplos jogos:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('❌ Erro na requisição de múltiplos jogos:', error.request);
        } else {
          console.error('❌ Erro desconhecido ao salvar múltiplos jogos:', error.message);
        }
        throw error;
      });
  }

}
