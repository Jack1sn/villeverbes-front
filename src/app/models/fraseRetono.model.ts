interface FraseRetorno {
  id: number;  // Identificador único da frase (obrigatório)
  pronome: string;  // Pronome obrigatório
  verboInfinitivo: string;  // Verbo no infinitivo obrigatório
  complementoDescricao: string;  // Descrição do complemento obrigatória
  respostaCorreta: string;  // Resposta correta obrigatória
  descricaoMontada: string;  // A frase montada obrigatória
}
