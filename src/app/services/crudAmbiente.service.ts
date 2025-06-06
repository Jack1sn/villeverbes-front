
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudAmbienteService {
  private readonly apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getFrases(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/frases-casa`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  deleteFrase(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/frases-casa/${id}`, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    });
  }

  // Buscar frase específica por ID
  getFrasePorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/frases-casa/${id}`);
  }

  // Adicionar nova frase
  addFrase(frase: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/frases-casa`, frase);
  }

  // Atualizar frase existente
  updateFrase(frase: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/frases-casa/${frase.id}`, frase);
  }

 

  

  // ========== ITENS DE SUPORTE (PRONOMES, VERBOS, ETC) ==========

  getPronomes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pronomes`);
  }

  getVerbos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/verbos`);
  }

  getComplementos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/complementos`);
  }

  getTemposVerbais(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tempos`);
  }
}
