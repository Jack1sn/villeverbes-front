import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Colaborador } from '../models/colaborador.model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  private apiUrl = 'http://localhost:8080/usuario/colaboradores';

  constructor(private http: HttpClient) {}

  // Método para listar todos os colaboradores
  listar(): Observable<Colaborador[]> {
    return this.http.get<Colaborador[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Método para excluir um colaborador
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

    // Método para salvar um novo colaborador
    salvar(colaborador: Colaborador): Observable<Colaborador> {
      return this.http.post<Colaborador>(this.apiUrl, colaborador).pipe(
        catchError(this.handleError)
      );
    }

  // Método para atualizar os dados de um colaborador
  atualizar(id: number, colaborador: Colaborador): Observable<Colaborador> {
    return this.http.put<Colaborador>(`${this.apiUrl}/${id}`, colaborador).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Erro inesperado:', error);
    throw error; // Re-lança o erro para o componente tratá-lo
  }
}
