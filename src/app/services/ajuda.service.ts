import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

export interface MensagemAjuda {
  id?: number;
  remetente: string;
  mensagem: string;
  dataEnvio?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AjudaService {
  private apiUrl = `${environment.apiUrl}/ajuda`;

  constructor(private http: HttpClient) {}

  listarMensagens(): Observable<MensagemAjuda[]> {
    return this.http.get<MensagemAjuda[]>(this.apiUrl).pipe(
      retry(1),
      map(mensagens =>
        mensagens.map(msg => ({
          ...msg,
          dataEnvio: msg.dataEnvio ? new Date(msg.dataEnvio) : undefined
        }))
      ),
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
        return of(); // Retorna observable vazio
      })
    );
  }
}
