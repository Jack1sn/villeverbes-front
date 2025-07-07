import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface que representa o DTO do backend
export interface SeloMedalhaDTO {
  id: number;
  usuarioJogoId: number;
  usuarioNome: string;
  seloCasa: number;
  seloParque: number;
  seloUniversidade: number;
  medalha: number;
}

@Injectable({
  providedIn: 'root',
})
export class TropheeService {
  private apiUrl = 'http://localhost:8080/api/selos';  // URL base do backend

  constructor(private http: HttpClient) {}

  // Buscar os selos/troféus básicos de um usuário específico (endpoint existente)
  getTrofeusPorUsuario(usuarioId: number): Observable<SeloMedalhaDTO[]> {
    return this.http.get<SeloMedalhaDTO[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  // Buscar todos os troféus (admin) — endpoint existente
  getTodosTrofeus(): Observable<SeloMedalhaDTO[]> {
    return this.http.get<SeloMedalhaDTO[]>(`${this.apiUrl}/todos`);
  }

  // Novo método para buscar todos os selos e medalhas do usuário (endpoint /usuario/{usuarioId}/todos)
  getTodosTrofeusPorUsuario(usuarioId: number): Observable<SeloMedalhaDTO[]> {
    return this.http.get<SeloMedalhaDTO[]>(`${this.apiUrl}/todos-simples`);
  }
}
