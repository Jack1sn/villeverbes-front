import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonagemService {
  // Comportamento inicial do personagem com "Utilisateur"
  private personagemSubject = new BehaviorSubject<string>('Utilisateur');
  
  // Observable para outros componentes se inscreverem
  personagem$ = this.personagemSubject.asObservable();

  constructor() {}

  // Método para definir o personagem
  setPersonagem(personagem: string): void {
    this.personagemSubject.next(personagem);
  }

  // Método para obter o personagem atual
  getPersonagem(): string {
    return this.personagemSubject.getValue(); // Obtém o valor atual do BehaviorSubject
  }
}
