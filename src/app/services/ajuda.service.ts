import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

export interface MensagemAjuda {
  id: number;
  remetente: string;
  mensagem: string;
  resposta?: string | null;
  dataEnvio?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AjudaService {
  private apiUrl = `${environment.apiUrl}/ajuda`;

  constructor(private http: HttpClient) {}

  // Modifiquei o método listarMensagens para aceitar os parâmetros de paginação
  listarMensagens(pagina: number = 1, quantidadePorPagina: number = 3): Observable<MensagemAjuda[]> {
    // Agora a URL da API inclui os parâmetros de paginação
    const url = `${this.apiUrl}?_page=${pagina}&_limit=${quantidadePorPagina}`;
    return this.http.get<MensagemAjuda[]>(url).pipe(
      retry(1),
      map(mensagens =>
        mensagens.map(msg => ({
          ...msg,
          dataEnvio: msg.dataEnvio ? new Date(msg.dataEnvio) : undefined
        }))
      ),
      catchError(err => {
        console.error('Erro ao buscar mensagens:', err);
        return of([]); // Retorna um array vazio em caso de erro
      })
    );
  }

  enviarMensagem(mensagem: MensagemAjuda): Observable<MensagemAjuda> {
    return this.http.post<MensagemAjuda>(this.apiUrl, mensagem).pipe(
      catchError(err => {
        console.error('Erro ao enviar mensagem:', err);
        return of(); // Observable vazio
      })
    );
  }

  contarNaoRespondidas(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/quantidade-nao-respondidas`).pipe(
      catchError(err => {
        console.error('[AjudaService] Erro ao contar mensagens não respondidas:', err);
        return of(0);
      })
    );
  }

  contarMensagensNaoRespondidas(): Observable<number> {
    return this.http.get<MensagemAjuda[]>(this.apiUrl).pipe(
      map(mensagens => mensagens.filter(m => !m.resposta || m.resposta.trim() === '').length),
      catchError(err => {
        console.error('Erro ao contar mensagens não respondidas:', err);
        return of(0);
      })
    );
  }

  responderEmail(id: number, resposta: string, remetente: string): Observable<any> {
    const url = `${this.apiUrl}/${id}/resposta`;
    // O backend espera que o corpo seja a string resposta, então enviamos um objeto com a propriedade 'resposta'
    return this.http.put(url, { resposta }).pipe(
      catchError(err => {
        console.error('Erro ao responder mensagem:', err);
        return of(null);
      })
    );
  }
}
