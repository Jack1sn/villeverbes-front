// models.ts
export interface Frase {
  id?: number;
  pronomeId: number;
  verboId: number;
  complemento: string;
  tempoId: number;
  resposta: string;


  // Apenas para exibição
  pronome?: string;
  verbo?: string;
  tempo?: string;
}
