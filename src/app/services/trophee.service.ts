import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface que representa o DTO do backend
export interface SeloMedalhaDTO {
  id: number;
  usuarioJogoId: number;
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

  // Buscar os selos/troféus de um usuário específico
  getTrofeusPorUsuario(usuarioId: number): Observable<SeloMedalhaDTO[]> {
    return this.http.get<SeloMedalhaDTO[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  // Caso tenha um endpoint para buscar todos os troféus (admin), ajustar a URL aqui
  getTodosTrofeus(): Observable<SeloMedalhaDTO[]> {
    return this.http.get<SeloMedalhaDTO[]>(`${this.apiUrl}/todos`); 
  }
}
