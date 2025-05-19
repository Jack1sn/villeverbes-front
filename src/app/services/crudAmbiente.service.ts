import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudAmbienteService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAmbientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ambientes`);
  }

  getFrases(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/frases`);
  }

  getTemposVerbais(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/tempos`);
  }

  getPronomes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/pronomes`);
  }

  getRespostasCertas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/respostas-certas`);
  }

  addAmbiente(ambiente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ambientes`, ambiente);
  }

  updateAmbiente(ambiente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/ambientes/${ambiente.id}`, ambiente);
  }

  deleteAmbiente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ambientes/${id}`);
  }
}
