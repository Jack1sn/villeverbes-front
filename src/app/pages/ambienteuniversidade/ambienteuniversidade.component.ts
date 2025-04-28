import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PersonagemService } from '../../services/personagem.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-ambienteuniversidade',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './ambienteuniversidade.component.html',
  styleUrls: ['./ambienteuniversidade.component.css'],
})
export class AmbienteuniversidadeComponent implements OnInit {
  personagemSelecionado: string | null = null;
  fraseSelecionada: string | null = null;
  respostaDigitada: string = '';
  resultado: string | null = null;
  progresso: number = 0;
  totalPerguntas = 11;
  perguntaAtual: number | null = null;

  frases: { [key: number]: string[] } = {
    1: ['Je (étudier) pour l’examen. Ind. Present ', 'Je (réviser) mes notes.'],
    2: ['Tu (écrire) un essai.', 'Tu (écouter) le professeur.'],
    3: ['Il (répondre) à une question.', 'Il (poser) une question.'],
    4: ['Nous (travailler) sur le projet.', 'Nous (discuter) en groupe.'],
    5: ['Vous (présenter) votre exposé.', 'Vous (corriger) les erreurs.'],
    6: ['Elles (apprendre) le français.', 'Elles (répéter) les verbes.'],
    7: ['Je (chercher) un livre à la bibliothèque.', 'Je (lire) un article.'],
    8: ['Tu (remplir) le formulaire.', 'Tu (envoyer) un e-mail.'],
    9: ['Il (utiliser) l’ordinateur.', 'Il (taper) un document.'],
    10: ['Nous (préparer) le test.', 'Nous (étudier) ensemble.'],
    11: ['Vous (assister) au cours.', 'Vous (noter) les points importants.'],
  };

  respostasCorretas: { [key: number]: string } = {
    1: 'étudie',
    2: 'écris',
    3: 'répond',
    4: 'travaillons',
    5: 'présentez',
    6: 'apprennent',
    7: 'cherche',
    8: 'remplis',
    9: 'utilise',
    10: 'préparons',
    11: 'assistez',
  };

  bolinhasClicadas: Set<number> = new Set();

  constructor(private router: Router, private personagemService: PersonagemService) {}

  ngOnInit(): void {
    this.personagemSelecionado = this.personagemService.getPersonagem();
  }

  navigate(destino: string): void {
    this.router.navigate(['/' + destino]);
  }

  selecionarFrase(numero: number): void {
    const opcoes = this.frases[numero];
    if (opcoes) {
      const aleatoria = opcoes[Math.floor(Math.random() * opcoes.length)];
      this.fraseSelecionada = aleatoria;
      this.respostaDigitada = '';
      this.resultado = null;
      this.perguntaAtual = numero;
      this.bolinhasClicadas.add(numero);
    }
  }

  verificarResposta(): void {
    if (this.perguntaAtual === null) return;

    const respostaCorreta = this.respostasCorretas[this.perguntaAtual];
    if (this.respostaDigitada.trim().toLowerCase() === respostaCorreta) {
      this.resultado = 'Félicitations!';
      this.progresso = Math.min(this.progresso + (100 / this.totalPerguntas), 100);
    } else {
      this.resultado = 'Mauvaise Réponse.';
    }
  }

  isBolaClicada(numero: number): boolean {
    return this.bolinhasClicadas.has(numero);
  }
}
