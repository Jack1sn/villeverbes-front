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
    1: ['Je _______ le lit.', 'Je _______ la table.'],
    2: ['Tu _______ la fenêtre.', 'Tu _______ la porte.'],
    3: ['Il _______ la porte.', 'Il _______ le rideau.'],
    4: ['Nous _______ le repas.', 'Nous _______ la vaisselle.'],
    5: ['Vous _______ les devoirs.', 'Vous _______ le travail.'],
    6: ['Elles _______ la télé.', 'Elles _______ la radio.'],
    7: ['Je _______ dans la cuisine.', 'Je _______ la soupe.'],
    8: ['Tu _______ les vêtements.', 'Tu _______ le t-shirt.'],
    9: ['Il _______ le sol.', 'Il _______ le tapis.'],
    10: ['Nous _______ le frigo.', 'Nous _______ la porte.'],
    11: ['Vous _______ le canapé.', 'Vous _______ la chaise.'],
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
