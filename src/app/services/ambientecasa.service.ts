import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AmbienteCasaService {
  constructor() {}

  verificarRespostaDigitada(respostaDigitada: string, respostaCorreta: string): boolean {
    return respostaDigitada.trim().toLowerCase() === respostaCorreta.toLowerCase();
  }
}
