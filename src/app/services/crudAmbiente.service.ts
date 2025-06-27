import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CrudAmbienteService {
  private readonly apiUrl = 'http://localhost:8080/api';
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
      withCredentials: true, // Se você usa cookies de sessão no backend
    });

    // Interceptor removido (não mais adiciona o token no header)
  }

  // -------- Frases --------

  async getFrases(): Promise<any[]> {
    const response = await this.axiosInstance.get('/frases');
    return response.data;
  }

  async getFrasePorId(id: number): Promise<any> {
    const response = await this.axiosInstance.get(`/frases/${id}`);
    return response.data;
  }

  async addFrase(frase: any): Promise<any> {
    const response = await this.axiosInstance.post('/frases', frase);
    return response.data;
  }

  async updateFrase(frase: any): Promise<any> {
    const response = await this.axiosInstance.put(`/frases/${frase.id}`, frase);
    return response.data;
  }

  async deleteFrase(id: number): Promise<any> {
    const response = await this.axiosInstance.delete(`/frases/${id}`);
    return response.data;
  }

  // -------- Itens de suporte --------

  async getPronomes(): Promise<any[]> {
    const response = await this.axiosInstance.get('/pronomes');
    return response.data;
  }

  async getVerbos(): Promise<any[]> {
    const response = await this.axiosInstance.get('/verbos');
    return response.data;
  }

  async getComplementos(): Promise<any[]> {
    const response = await this.axiosInstance.get('/complementos');
    return response.data;
  }

  async getTemposVerbais(): Promise<any[]> {
    const response = await this.axiosInstance.get('/tempos');
    return response.data;
  }
}
