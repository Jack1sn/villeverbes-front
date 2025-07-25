import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from 'src/environments/environment'; // ✅ Importa o base URL do ambiente

@Injectable({
  providedIn: 'root',
})
export class CrudAmbienteService {
  private readonly apiUrl = `${environment.apiUrl}/api`; // ✅ Base dinâmica correta
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
      withCredentials: true, // Habilita cookies se necessário
    });

    // Interceptor para token de autenticação (descomentável)
    // this.axiosInstance.interceptors.request.use(config => {
    //   const token = localStorage.getItem('token');
    //   if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    //   }
    //   return config;
    // });
  }

  // ------------------- CRUD de Frases -------------------

  /** Lista todas as frases */
  async getFrases(): Promise<any[]> {
    const response = await this.axiosInstance.get('/frases');
    return response.data;
  }

  /** Busca uma frase por ID */
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

  // ------------------- Itens de apoio linguístico -------------------

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
