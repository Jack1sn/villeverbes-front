export interface JogoData {
  personagem?: string | null;
  ambiente?: 'casa' | 'parque' | 'universidade';
  acertos?: number;
  total?: number;
  acertoPorAmbiente?: string;
  nomeUsuario?: string;
}
