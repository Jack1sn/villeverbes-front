import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface MensagemAjuda {
  id?: number;
  remetente: string;
  mensagem: string;
  dataEnvio?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AjudaService {
  private apiUrl = `${environment.apiUrl}/ajuda-emails`;

  constructor(private http: HttpClient) {}

  listarMensagens(): Observable<MensagemAjuda[]> {
    return this.http.get<MensagemAjuda[]>(this.apiUrl).pipe(
      retry(1),
      catchError(err => {
        console.error('Erro ao buscar mensagens:', err);
        return of([]);
      })
    );
  }

  enviarMensagem(mensagem: MensagemAjuda): Observable<MensagemAjuda> {
    return this.http.post<MensagemAjuda>(this.apiUrl, mensagem).pipe(
      catchError(err => {
        console.error('Erro ao enviar mensagem:', err);
        return of(); // Retorna observable vazio para evitar quebra
      })
    );
  }
}
