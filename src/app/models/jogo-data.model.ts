// src/app/models/jogo-data.model.ts

export interface JogoData {
  personagem: string | null;
  ambiente: string;
  acertos: number;
  total: number;
  acertoPorAmbiente: string;
  data: string;
}
