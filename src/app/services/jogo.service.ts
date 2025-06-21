import { Injectable } from '@angular/core';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { JogoData } from '../models/jogo-data.model';
// import { format } from 'date-fns'; // Use se for necessário formatar a data

@Injectable({
  providedIn: 'root',
})
export class JogoService {
  private apiUrl = 'http://localhost:8080/api/jogo'; // URL base da API

  constructor() {}

  /**
   * Salva o resultado do jogo no backend
   * @param usuarioId ID do usuário
   * @param jogoData Objeto com dados do jogo
   */
  salvarResultadoJogo(usuarioId: number, jogoData: JogoData): Promise<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token de autenticação não encontrado no localStorage.');
      return Promise.reject('Token ausente');
    }

    // ✅ Se precisar de data formatada, descomente:
    // jogoData.data = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

    // ✅ Salvar temporariamente no localStorage (opcional para recuperação futura)
    localStorage.setItem('ultimoResultadoJogo', JSON.stringify(jogoData));

    return axios
      .post(`${this.apiUrl}/${usuarioId}`, jogoData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response: AxiosResponse) => {
        console.log('✅ Dados salvos com sucesso:', response.data);
        return response.data;
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          console.error('❌ Erro da API:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('❌ Erro na requisição:', error.request);
        } else {
          console.error('❌ Erro desconhecido:', error.message);
        }
        throw error;
      });
  }
}
