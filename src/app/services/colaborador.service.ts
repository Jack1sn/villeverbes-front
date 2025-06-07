import { Injectable } from '@angular/core';
import axios from 'axios';
import { Colaborador } from '../models/colaborador.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  private apiUrl = `${environment.apiUrl}/usuario/colaboradores`;

  constructor() {}

  async listar(): Promise<Colaborador[]> {
    try {
      const response = await axios.get<Colaborador[]>(this.apiUrl);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async excluir(id: number): Promise<void> {
    try {
      await axios.delete(`${this.apiUrl}/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  async salvar(colaborador: Colaborador): Promise<{ message: string, usuario: Colaborador }> {
    try {
      const response = await axios.post(`${environment.apiUrl}/usuario/colaborador`, colaborador);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async atualizar(id: number, colaborador: Colaborador): Promise<Colaborador> {
    try {
      const response = await axios.put(`${this.apiUrl}/${id}`, colaborador);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    console.error('Erro no ColaboradorService:', error);
    throw error;
  }
}
