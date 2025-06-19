import { Injectable } from '@angular/core';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { JogoData } from '../models/jogo-data.model';




@Injectable({
  providedIn: 'root',
})
export class JogoService {
  private apiUrl = 'http://localhost:8080/api/jogos';  // URL da API para o backend

  constructor() {}

  /**
   * Função para salvar o resultado do jogo no backend
   * @param usuarioId ID do usuário
   * @param jogoData Dados do jogo (incluindo personagem, ambiente, acertos, etc)
   */
  salvarResultadoJogo(usuarioId: number, jogoData: JogoData): Promise<any> {
    return axios
      .post(`${this.apiUrl}/${usuarioId}`, jogoData)  // URL com o usuarioId
      .then((response: AxiosResponse) => {
        console.log('Dados salvos com sucesso:', response.data);
        return response.data;  // Retorna os dados da resposta do servidor
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          console.error('Erro ao salvar os dados:', error.response.data);
        } else {
          console.error('Erro desconhecido:', error.message);
        }
        throw error;  // Lança o erro para ser tratado no componente
      });
  }
}
