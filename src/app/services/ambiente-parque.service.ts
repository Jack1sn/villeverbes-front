import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

// Interfaces para as frases
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
export class AmbienteParqueService {
  private readonly apiUrlFrases = 'http://localhost:8080/api/frases';
  private readonly apiUrlJogo = 'http://localhost:8080/api/jogo';

  constructor() {}

  async getFrasesParque(): Promise<Frase[]> {
    try {
      const response = await axios.get<FraseApi[]>(this.apiUrlFrases);
      const frasesApi = response.data;

      // Filtrar apenas frases com IDs entre 23 e 44 (ambiente parque)
      const frasesFiltradas = frasesApi
        .filter(f => f.id >= 23 && f.id <= 44)
        .map(f => {
          let descricao = f.descricaoMontada || '';
          const resposta = f.respostaCorreta.trim();

          if (resposta && descricao.toLowerCase().includes(resposta.toLowerCase())) {
            const regex = new RegExp(resposta, 'i');
            descricao = descricao.replace(regex, '').trim();
          }

          return {
            frase: descricao || 'Frase indisponível',
            respostaCorreta: resposta
          };
        });

      return frasesFiltradas;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Erro ao buscar frases do parque:', error.response?.data || error.message);
      } else {
        console.error('Erro desconhecido:', error);
      }
      throw new Error(error instanceof AxiosError ? error.response?.data?.message || 'Erro desconhecido' : 'Não foi possível carregar as frases do ambiente parque.');
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
