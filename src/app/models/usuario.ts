type Perfil = 'ADMIN' | 'JOGADOR' ;

export interface Usuario {
  id?: number;
  nome: string;
  cpf: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  perfil: Perfil;
  email: string;
}
