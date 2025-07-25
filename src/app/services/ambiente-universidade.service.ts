import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';
import { environment } from 'src/environments/environment';

// Interfaces para frases
export interface FraseApi {
  id: number;
  descricaoMontada: string;
  respostaCorreta: string;
}

export interface Frase {
  frase: string;
  respostaCorreta: string;
}

// Interface para os dados do jogo
export interface JogoData {
  personagem: string;
  ambiente: string;
  acertos: number;
  total: number;
  porcentagem: number;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class AmbienteUniversidadeService {
  private readonly apiUrlFrases = `${environment.apiUrl}/api/frases`;
  private readonly apiUrlJogo = `${environment.apiUrl}/api/jogos`;

  constructor() {}

  /**
   * Busca as frases relacionadas ao ambiente "universidade"
   */
  async getFrasesUniversidade(): Promise<Frase[]> {
    try {
      const response = await axios.get<FraseApi[]>(this.apiUrlFrases);
      const frasesApi = response.data;

      return frasesApi.map(f => {
        let descricao = f.descricaoMontada?.trim() || 'Frase indisponível';
        const resposta = f.respostaCorreta?.trim() || '???';

        if (resposta && descricao.toLowerCase().includes(resposta.toLowerCase())) {
          const regex = new RegExp(resposta, 'i');
          descricao = descricao.replace(regex, '').trim();
        }

        return {
          frase: descricao,
          respostaCorreta: resposta,
        };
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('❌ Erro ao buscar frases da universidade:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Erro ao buscar frases da universidade.');
      } else {
        console.error('❌ Erro desconhecido:', error);
        throw new Error('Não foi possível carregar as frases do ambiente universidade.');
      }
    }
  }

  /**
   * Verifica se a resposta digitada é correta
   */
  verificarRespostaDigitada(respostaDigitada: string, respostaCorreta: string): boolean {
    if (!respostaDigitada || !respostaCorreta) return false;
    return respostaDigitada.trim().toLowerCase() === respostaCorreta.trim().toLowerCase();
  }

  /**
   * Envia os dados do jogo para o backend
   */
  async salvarResultadoJogo(usuarioId: number, jogoData: JogoData): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${this.apiUrlJogo}/${usuarioId}`, jogoData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Resultado do jogo salvo com sucesso.');
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('❌ Erro ao salvar o resultado do jogo:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Erro ao salvar resultado do jogo.');
      } else {
        console.error('❌ Erro desconhecido:', error);
        throw new Error('Não foi possível salvar o resultado do jogo.');
      }
    }
  }
}
