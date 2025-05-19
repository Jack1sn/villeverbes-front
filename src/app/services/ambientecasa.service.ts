import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AmbienteCasaService {
  constructor() {}

  verificarRespostaDigitada(respostaDigitada: string, respostaCorreta: string): boolean {
    return respostaDigitada.trim().toLowerCase() === respostaCorreta.toLowerCase();
  }

  getFrasesCasa(): Observable<{ frase: string, resposta: string }[]> {
    // 🔁 Aqui pode vir de API futuramente. Por enquanto, simulação mock:
    const frases = [
      { frase: 'Je mange une pomme', resposta: 'mange' },
      { frase: 'Tu vas à l\'école', resposta: 'vas' },
      { frase: 'Il lit un livre', resposta: 'lit' },
      { frase: 'Nous faisons du sport', resposta: 'faisons' },
      { frase: 'Vous regardez la télévision', resposta: 'regardez' },
      { frase: 'Elles jouent au football', resposta: 'jouent' },
      { frase: 'Je bois de l\'eau', resposta: 'bois' },
      { frase: 'Tu écris une lettre', resposta: 'écris' },
      { frase: 'Il prend le bus', resposta: 'prend' },
      { frase: 'Nous aimons le chocolat', resposta: 'aimons' }
    ];
    return of(frases);
  }
}
