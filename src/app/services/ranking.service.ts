import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // ✅ Usando environment

// Interface que representa o DTO vindo do backend
export interface JogadorRanking {
  id: number;
  usuarioJogoId: number;
  seloCasa: number;
  seloParque: number;
  seloUniversidade: number;
  medalha: number;
  posicao: number;
  personagem?: string; // Opcional, pode vir do backend
}

@Injectable({
  providedIn: 'root',
})
export class RankingService {
  private apiUrl = `${environment.apiUrl}/api/selos`; // ✅ Base dinâmica da API

  constructor(private http: HttpClient) {}

  /**
   * Retorna o ranking geral de jogadores (admin)
   * @returns Lista ordenada de jogadores com posição e conquistas
   */
  getRankingGeral(): Observable<JogadorRanking[]> {
    return this.http.get<JogadorRanking[]>(`${this.apiUrl}/ranking`);
  }

  /**
   * Retorna os dados de ranking de um jogador específico
   * @param usuarioId ID do jogador
   * @returns Ranking individual com selos e medalhas
   */
  getRankingPorUsuario(usuarioId: string): Observable<JogadorRanking[]> {
    return this.http.get<JogadorRanking[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  /**
   * Busca todos os jogadores com seus selos e medalhas (modo simples)
   * @returns Lista de jogadores com dados resumidos
   */
  getTodosSimples(): Observable<JogadorRanking[]> {
    return this.http.get<JogadorRanking[]>(`${this.apiUrl}/todos-simples`);
  }
}
