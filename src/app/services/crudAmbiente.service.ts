import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudAmbienteService {

  private ambientesMock: any[] = [
    {
      id: 1,
      nome: 'Casa',
      tempoVerbal: 'Présent',
      fundoImagem: '',
      frases: [
        {
          pronome: 'Je',
          verbo: 'manger',
          complemento: 'une pomme',
          resposta: 'mange'
        }
      ]
    },
    {
      id: 2,
      nome: 'Parque',
      tempoVerbal: 'Présent',
      fundoImagem: '',
      frases: [  {
        pronome: 'Nous',
        verbo: 'Faire',
        complemento: 'faisons',
        resposta: 'étudiait'
      }]
    },  {
      id: 3,
      nome: 'Université',
      tempoVerbal: 'Présent',
      fundoImagem: '',
      frases: [
        {
          pronome: 'Elle',
          verbo: 'Étudier',
          complemento: 'la médicine',
          resposta: 'étudie'
        }
      ]
    }
  ];

  private pronomesMock: string[] = ['Je', 'Tu', 'Il', 'Elle', 'Nous', 'Vous', 'Ils', 'Elles'];
  
  private temposVerbaisMock: string[] = [
    'Présent', 
    'Passé Composé', 
    'Futur', 
    'Imparfait', 
    'Passé Simple'
  ];

  private respostasCertasMock = [
    { frase: 'Je ______ une pomme.', resposta: 'mange' },
    { frase: 'Tu ____ de l’eau.', resposta: 'bois' },
    { frase: 'Il _____ le chien.', resposta: 'voit' },
    { frase: 'Nous ____ une voiture.', resposta: 'avons' },
    { frase: 'Vous ___ à la maison.', resposta: 'êtes' },
    { frase: 'Ils ____ au parc.', resposta: 'jouent' },
    { frase: 'Je ___ mes devoirs.', resposta: 'finis' },
    { frase: 'Elle ___ un livre.', resposta: 'lit' },
    { frase: 'Nous _____ à 8h.', resposta: 'partons' }
  ];

  // ======= Métodos públicos mockados =======

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

  // ======= Código real com backend (comentado) =======

  /*
  private apiUrl = 'http://localhost:8080/api';

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
