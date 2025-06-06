import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Colaborador } from '../models/colaborador.model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  private apiUrl = 'http://localhost:8080/usuario/colaboradores';

  constructor(private http: HttpClient) {}

  listar(): Observable<Colaborador[]> {
    return this.http.get<Colaborador[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  salvar(colaborador: Colaborador): Observable<{ message: string, usuario: Colaborador }> {
    return this.http.post<{ message: string, usuario: Colaborador }>(
      'http://localhost:8080/usuario/colaborador',
      colaborador
    ).pipe(
      catchError(this.handleError)
    );
  }

  atualizar(id: number, colaborador: Colaborador): Observable<Colaborador> {
    return this.http.put<Colaborador>(`${this.apiUrl}/${id}`, colaborador).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Erro inesperado:', error);
    throw error;
  }
}
