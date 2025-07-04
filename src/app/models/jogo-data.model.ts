export interface JogoData {
  personagem?: string | null;
  ambiente?: 'casa' | 'parque' | 'universidade';
  acertos?: number;
  acertosCasa?:number;
  acertosParque?:number;
  acertosUniversidade?:number;
  totalAcertos?: number;
  acertoPorAmbiente?: string;
  nomeUsuario?: string;
  data?: string;
  

}
