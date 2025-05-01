import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressoService {

  // Armazena a quantidade de acertos para cada ambiente
  private progresso: { [ambiente: string]: number } = {
    casa: 0,
    parque: 0,
    universidade: 0
  };

  // Retorna a quantidade de acertos para o ambiente especificado
  getProgresso(ambiente: 'casa' | 'parque' | 'universidade'): number {
    return this.progresso[ambiente] || 0;
  }

  // Atualiza a quantidade de acertos para o ambiente especificado
  setProgresso(ambiente: 'casa' | 'parque' | 'universidade', valor: number): void {
    this.progresso[ambiente] = valor;
  }

  // Incrementa 1 ponto (caso você prefira usar isso em vez de set direto)
  incrementar(ambiente: 'casa' | 'parque' | 'universidade'): void {
    this.progresso[ambiente]++;
  }

  // Resetar todos os progressos se necessário
  resetarProgresso(): void {
    this.progresso = {
      casa: 0,
      parque: 0,
      universidade: 0
    };
  }
}
