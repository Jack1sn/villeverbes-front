import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PersonagemService } from '../../services/personagem.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-ambientecasa',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './ambientecasa.component.html',
  styleUrls: ['./ambientecasa.component.css'],
})
export class AmbientecasaComponent implements OnInit {
  personagemSelecionado: string | null = null;
  fraseSelecionada: string | null = null;
  respostaDigitada: string = '';
  resultado: string | null = null;
  progresso: number = 0;
  totalPerguntas = 11;
  perguntaAtual: number | null = null;

  frases: { [key: number]: string[] } = {
    1: ['Je _______ le lit. (faire)', 'Je _______ la table. (faire)'],
    2: ['Tu _______ la fenêtre. (ouvrir)', 'Tu _______ la porte. (ouvrir)'],
    3: ['Il _______ la porte. (fermer)', 'Il _______ le rideau. (fermer)'],
    4: ['Nous _______ le repas. (préparer)', 'Nous _______ la vaisselle. (préparer)'],
    5: ['Vous _______ les devoirs. (faire)', 'Vous _______ le travail. (faire)'],
    6: ['Elles _______ la télé. (regarder)', 'Elles _______ la radio. (écouter)'],
    7: ['Je _______ dans la cuisine. (cuisiner)', 'Je _______ la soupe. (cuisiner)'],
    8: ['Tu _______ les vêtements. (plier)', 'Tu _______ le t-shirt. (plier)'],
    9: ['Il _______ le sol. (nettoyer)', 'Il _______ le tapis. (nettoyer)'],
    10: ['Nous _______ le frigo. (ouvrir)', 'Nous _______ la porte. (ouvrir)'],
    11: ['Vous _______ le canapé. (débarrasser)', 'Vous _______ la chaise. (débarrasser)'],
  };

  respostasCorretas: { [key: number]: string } = {
    1: 'fais',
    2: 'ouvres',
    3: 'ferme',
    4: 'préparons',
    5: 'faites',
    6: 'regardent',
    7: 'cuisine',
    8: 'plies',
    9: 'nettoie',
    10: 'ouvrons',
    11: 'débarrassez',
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
