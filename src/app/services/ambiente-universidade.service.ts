import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

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
  private readonly apiUrlFrases = 'http://localhost:8080/api/frases';
  private readonly apiUrlJogo = 'http://localhost:8080/api/jogos';

  constructor() {}

  async getFrasesUniversidade(): Promise<Frase[]> {
  try {
    const response = await axios.get<FraseApi[]>(this.apiUrlFrases);  // Supondo que o endpoint seja o mesmo, caso contrário, altere a URL.
    const frasesApi = response.data;

    return frasesApi.map(f => {
      let descricao = f.descricaoMontada?.trim() || 'Frase indisponível';
      const resposta = f.respostaCorreta?.trim() || '???';

      // Caso a resposta esteja dentro da descrição, removemos ela da frase
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
      console.error('Erro ao buscar frases da universidade:', error.response?.data || error.message);
    } else {
      console.error('Erro desconhecido:', error);
    }
    throw new Error('Não foi possível carregar as frases do ambiente universidade.');
  }
}


  verificarRespostaDigitada(respostaDigitada: string, respostaCorreta: string): boolean {
    if (!respostaDigitada || !respostaCorreta) return false;
    return respostaDigitada.trim().toLowerCase() === respostaCorreta.trim().toLowerCase();
  }

  async salvarResultadoJogo(usuarioId: number, jogoData: JogoData): Promise<void> {
    try {
      const response = await axios.post(`${this.apiUrlJogo}/${usuarioId}`, jogoData);
      console.log('Resultado do jogo salvo com sucesso:', response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Erro ao salvar o resultado do jogo:', error.response?.data || error.message);
      } else {
        console.error('Erro desconhecido:', error);
      }
      throw new Error('Não foi possível salvar o resultado do jogo.');
    }
  }
}
