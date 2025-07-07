import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface que representa o DTO vindo do backend
export interface JogadorRanking {
  id: number;
  usuarioJogoId: number;
  seloCasa: number;
  seloParque: number;
  seloUniversidade: number;
  medalha: number;
  posicao: number;
  personagem?: string;
}

@Injectable({
  providedIn: 'root',
})
export class RankingService {
  private apiUrl = 'http://localhost:8080/api/selos'; // base do backend

  constructor(private http: HttpClient) {}

  /** Buscar o ranking geral para admin */
  getRankingGeral(): Observable<JogadorRanking[]> {
    return this.http.get<JogadorRanking[]>(`${this.apiUrl}/ranking`);
  }

  /** Buscar o ranking de um jogador específico por ID */
  getRankingPorUsuario(usuarioId: string): Observable<JogadorRanking[]> {
    return this.http.get<JogadorRanking[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  /** Buscar todos os selos e medalhas de forma simples (endpoint novo) */
  getTodosSimples(): Observable<JogadorRanking[]> {
    return this.http.get<JogadorRanking[]>(`${this.apiUrl}/todos-simples`);
  }
}
