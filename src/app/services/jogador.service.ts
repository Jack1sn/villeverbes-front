import { Injectable } from '@angular/core';
import axios from 'axios';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class JogadorService {
  private baseUrl = 'http://localhost:8080';

  async listarJogadores(): Promise<Usuario[]> {
    const response = await axios.get(`${this.baseUrl}/usuario/jogadores`);
    return response.data;
  }

  async alterarStatusJogador(id: number, ativo: boolean): Promise<void> {
    await axios.put(`${this.baseUrl}/usuario/jogadores/${id}/status`, { ativo });
  }

  async autoCadastro(Jogador: Usuario): Promise<any> {
    const url = `${this.baseUrl}/jogador/autocadastro`;
    const response = await axios.post(url, Jogador);
    return response.data;
  }
}
