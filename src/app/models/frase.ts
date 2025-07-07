export interface Frase {
  id?: number;
  pronomeId: number;
  verboId: number;           // igual a verboInfinitivoId no backend
  tempoId: number;           // igual a tempoVerbalId no backend
  complemento: string;
  complementoId: number;
  resposta: string;
   complementoDescricao?: string;

  // Extras para exibição no frontend (não usados no envio à API)
  pronome?: string;
  verbo?: string;
  tempo?: string;
  
}
