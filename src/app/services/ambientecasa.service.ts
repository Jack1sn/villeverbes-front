import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  /**
   * Busca frases da API e remove a resposta correta da descrição exibida, para não mostrar a resposta ao jogador.
   */
  getFrasesCasa(): Observable<Frase[]> {
    return this.http.get<FraseApi[]>(this.apiUrl).pipe(
      map(frases => frases.map(f => {
        let descricao = f.descricaoMontada || '';

        // Remove a resposta correta da frase montada para esconder do jogador (se estiver embutida)
        const resposta = f.respostaCorreta.trim();
        if (resposta && descricao.toLowerCase().includes(resposta.toLowerCase())) {
          // Substitui apenas a primeira ocorrência da resposta correta (caso esteja no texto)
          const regex = new RegExp(resposta, 'i');
          descricao = descricao.replace(regex, '').trim();
        }

        return {
          frase: descricao,
          respostaCorreta: resposta
        };
      }))
    );
  }

  /**
   * Verifica se a resposta digitada está correta.
   * Compara ignorando maiúsculas, minúsculas e espaços em branco no início/fim.
   */
  verificarRespostaDigitada(respostaDigitada: string, respostaCorreta: string): boolean {
    if (!respostaDigitada || !respostaCorreta) return false;

    return respostaDigitada.trim().toLowerCase() === respostaCorreta.trim().toLowerCase();
  }
}
