import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // ✅ Importa ambiente

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
  // ✅ Usa o valor do arquivo de ambiente (dev ou prod)
  private apiUrl = `${environment.apiUrl}/api/selos`;

  constructor(private http: HttpClient) {
    console.log('[TropheeService] API URL usada:', this.apiUrl); // 🔍 Para depuração
  }

  /**
   * Buscar os selos/troféus básicos de um usuário específico
   * Endpoint: GET /api/selos/usuario/{usuarioId}
   */
  getTrofeusPorUsuario(usuarioId: number): Observable<SeloMedalhaDTO[]> {
    return this.http.get<SeloMedalhaDTO[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  /**
   * Buscar todos os troféus (admin)
   * Endpoint: GET /api/selos/todos
   */
  getTodosTrofeus(): Observable<SeloMedalhaDTO[]> {
    return this.http.get<SeloMedalhaDTO[]>(`${this.apiUrl}/todos`);
  }

  /**
   * Novo método para buscar todos os selos e medalhas simplificados
   * Endpoint: GET /api/selos/todos-simples
   */
  getTodosTrofeusPorUsuario(usuarioId: number): Observable<SeloMedalhaDTO[]> {
    return this.http.get<SeloMedalhaDTO[]>(`${this.apiUrl}/todos-simples`);
  }
}
