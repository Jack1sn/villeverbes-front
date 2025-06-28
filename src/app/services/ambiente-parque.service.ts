import { Injectable } from '@angular/core';
import axios, { AxiosError } from 'axios';

export interface FraseApi {
  id: number;
  descricaoMontada: string;
  respostaCorreta: string;
}

export interface Frase {
  frase: string;
  respostaCorreta: string;
}

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
    console.log('Resposta da API recebida:', response.data);  // Verifique o que a API está retornando

    if (!Array.isArray(response.data)) {
      throw new Error('Formato inesperado da resposta da API.');
    }

    // Não há filtro, agora vamos pegar todas as frases
    const frases = response.data
      .map(f => {
        let descricao = f.descricaoMontada?.trim() || 'Frase indisponível';
        const resposta = (f.respostaCorreta || '').trim();

        if (resposta && descricao.toLowerCase().includes(resposta.toLowerCase())) {
          const regex = new RegExp(resposta, 'i');
          descricao = descricao.replace(regex, '').trim();
        }

        return {
          frase: descricao,
          respostaCorreta: resposta || '???',  // Garantir resposta padrão se não existir
        };
      });

    console.log('Frases carregadas:', frases);  // Verifique as frases carregadas

    return frases;

  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Erro ao buscar frases:', error.response?.data || error.message);
    } else {
      console.error('Erro ao carregar frases:', error);
    }
    throw new Error('Não foi possível carregar as frases do ambiente parque.');
  }
}

  async verificarRespostaDigitada(respostaDigitada: string, respostaCorreta: string): Promise<boolean> {
    if (!respostaDigitada || !respostaCorreta) return false;
    return respostaDigitada.trim().toLowerCase() === respostaCorreta.trim().toLowerCase();
  }

  async salvarResultadoJogo(usuarioId: number, jogoData: JogoData): Promise<void> {
    try {
      await axios.post(`${this.apiUrlJogo}/${usuarioId}`, jogoData);
    } catch (error) {
      console.error('Erro ao salvar resultado do jogo:', error);
      throw new Error('Não foi possível salvar o resultado.');
    }
  }
}
