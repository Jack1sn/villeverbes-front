import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'; // ✅ Importa a URL da API

@Injectable({
  providedIn: 'root',
})
export class CrudAmbienteService {
  private readonly apiUrl = `${environment.apiUrl}/api`; // ✅ Base dinâmica
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
      withCredentials: true, // Se necessário para cookies de sessão
    });

    // Se desejar usar token no futuro, você pode adicionar aqui:
    // this.axiosInstance.interceptors.request.use(config => {
    //   const token = localStorage.getItem('token');
    //   if (token) config.headers.Authorization = `Bearer ${token}`;
    //   return config;
    // });
  }

  // -------- FRases CRUD --------

  /** Busca todas as frases */
  async getFrases(): Promise<any[]> {
    const response = await this.axiosInstance.get('/frases');
    return response.data;
  }

  /** Busca uma frase específica por ID */
  async getFrasePorId(id: number): Promise<any> {
    const response = await this.axiosInstance.get(`/frases/${id}`);
    return response.data;
  }

  /** Cadastra nova frase */
  async addFrase(frase: any): Promise<any> {
    const response = await this.axiosInstance.post('/frases', frase);
    return response.data;
  }

  /** Atualiza uma frase existente */
  async updateFrase(frase: any): Promise<any> {
    const response = await this.axiosInstance.put(`/frases/${frase.id}`, frase);
    return response.data;
  }

  /** Remove uma frase pelo ID */
  async deleteFrase(id: number): Promise<any> {
    const response = await this.axiosInstance.delete(`/frases/${id}`);
    return response.data;
  }

  // -------- Itens de apoio --------

  /** Lista todos os pronomes */
  async getPronomes(): Promise<any[]> {
    const response = await this.axiosInstance.get('/pronomes');
    return response.data;
  }

  /** Lista todos os verbos */
  async getVerbos(): Promise<any[]> {
    const response = await this.axiosInstance.get('/verbos');
    return response.data;
  }

  /** Lista todos os complementos */
  async getComplementos(): Promise<any[]> {
    const response = await this.axiosInstance.get('/complementos');
    return response.data;
  }

  /** Lista todos os tempos verbais */
  async getTemposVerbais(): Promise<any[]> {
    const response = await this.axiosInstance.get('/tempos');
    return response.data;
  }
}
