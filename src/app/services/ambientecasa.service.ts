import { Injectable } from '@angular/core';
import axios from 'axios';

export interface FraseApi {
  id: number;
  descricaoMontada: string;
  respostaCorreta: string;
}

export interface Frase {
  frase: string;
  respostaCorreta: string;
}

@Injectable({
  providedIn: 'root'
})
export class AmbienteCasaService {
  private readonly apiUrl = 'http://localhost:8080/api/frases-casa';

  constructor() {}

  /**
   * Busca frases da API com Axios e remove a resposta correta da descrição.
   */
  async getFrasesCasa(): Promise<Frase[]> {
    try {
      const response = await axios.get<FraseApi[]>(this.apiUrl);
      const frasesApi = response.data;

      return frasesApi.map(f => {
        let descricao = f.descricaoMontada || '';
        const resposta = f.respostaCorreta.trim();

        if (resposta && descricao.toLowerCase().includes(resposta.toLowerCase())) {
          const regex = new RegExp(resposta, 'i');
          descricao = descricao.replace(regex, '').trim();
        }

        return {
          frase: descricao,
          respostaCorreta: resposta
        };
      });
    } catch (error) {
      console.error('Erro ao buscar frases da casa:', error);
      throw new Error('Não foi possível carregar as frases do ambiente casa.');
    }
  }

  /**
   * Verifica se a resposta digitada está correta (ignora maiúsculas e espaços).
   */
  verificarRespostaDigitada(respostaDigitada: string, respostaCorreta: string): boolean {
    if (!respostaDigitada || !respostaCorreta) return false;

    return respostaDigitada.trim().toLowerCase() === respostaCorreta.trim().toLowerCase();
  }
}
