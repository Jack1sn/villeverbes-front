import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudAmbienteService {
  // backend 
  // private apiUrl = 'http://localhost:8080/api';

  private ambientesMock: any[] = [
    {
      id: 1,
      nome: 'Casa',
      tempoVerbal: 'Présent',
      fundoImagem: '',
      frases: [
        { pronome: 'Je', verbo: 'mange', resposta: 'Je mange une pomme' }
      ]
    }
  ];

  private pronomesMock: string[] = ['Je', 'Tu', 'Il', 'Elle', 'Nous', 'Vous', 'Ils'];
  private temposVerbaisMock: string[] = ['Présent', 'Passé Composé', 'Futur'];
  private respostasCertasMock = [
    { frase: 'Je mange une pomme.', resposta: 'mange' },
    { frase: 'Tu bois de l\’eau.', resposta: 'bois' },
    { frase: 'Il voit le chien.', resposta: 'voit' },
    { frase: 'Nous avons une voiture.', resposta: 'avons' },
    { frase: 'Vous êtes à la maison.', resposta: 'êtes' },
    { frase: 'Ils jouent au parc.', resposta: 'jouent' },
    { frase: 'Je finis mes devoirs.', resposta: 'finis' },
    { frase: 'Elle lit un livre.', resposta: 'lit' },
    { frase: 'Nous partons à 8h.', resposta: 'partons' }
  ];

 

  getAmbientes(): Observable<any[]> {
    return of(this.ambientesMock);
  }

  getTemposVerbais(): Observable<string[]> {
    return of(this.temposVerbaisMock);
  }

  getPronomes(): Observable<string[]> {
    return of(this.pronomesMock);
  }

  getRespostasCertas(): Observable<any[]> {
    return of(this.respostasCertasMock);
  }

  addAmbiente(novoAmbiente: any): Observable<any> {
    const novo = { ...novoAmbiente, id: Date.now() };
    this.ambientesMock.push(novo);
    return of(novo);
  }

  updateAmbiente(ambienteAtualizado: any): Observable<any> {
    const index = this.ambientesMock.findIndex(a => a.id === ambienteAtualizado.id);
    if (index !== -1) {
      this.ambientesMock[index] = ambienteAtualizado;
    }
    return of(ambienteAtualizado);
  }

  deleteAmbiente(id: number): Observable<any> {
    this.ambientesMock = this.ambientesMock.filter(a => a.id !== id);
    return of({ success: true });
  }

  // ======== Código real com backend (comentado) ========

  /*
  constructor(private http: HttpClient) {}

  getAmbientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ambientes`);
  }

  getTemposVerbais(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/tempos`);
  }

  getPronomes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/pronomes`);
  }

  getRespostasCertas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/respostas-certas`);
  }

  addAmbiente(ambiente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/ambientes`, ambiente);
  }

  updateAmbiente(ambiente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/ambientes/${ambiente.id}`, ambiente);
  }

  deleteAmbiente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ambientes/${id}`);
  }
  */
}
