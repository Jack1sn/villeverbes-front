import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PersonagemService } from '../../services/personagem.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-ambienteparque',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './ambienteparque.component.html',
  styleUrls: ['./ambienteparque.component.css'],
})
export class AmbienteparqueComponent implements OnInit {
  personagemSelecionado: string | null = null;
  fraseSelecionada: string | null = null;
  respostaDigitada: string = '';
  resultado: string | null = null;
  progresso: number = 0;
  totalPerguntas = 11;
  perguntaAtual: number | null = null;

  frases: { [key: number]: string[] } = {
    1: ['Je (jouer) au ballon.', 'Je (marcher) dans le parc.'],
    2: ['Tu (lancer) le frisbee.', 'Tu (regarder) les oiseaux.'],
    3: ['Il (courir) sur l’herbe.', 'Il (jouer) avec son chien.'],
    4: ['Nous (faire) du vélo.', 'Nous (manger) une glace.'],
    5: ['Vous (lire) un livre.', 'Vous (écouter) de la musique.'],
    6: ['Elles (chanter) sous un arbre.', 'Elles (jouer) à cache-cache.'],
    7: ['Je (dessiner) les fleurs.', 'Je (observer) les nuages.'],
    8: ['Tu (prendre) des photos.', 'Tu (arroser) les plantes.'],
    9: ['Il (faire) du roller.', 'Il (monter) sur la balançoire.'],
    10: ['Nous (jouer) au foot.', 'Nous (rire) ensemble.'],
    11: ['Vous (attraper) la balle.', 'Vous (crier) de joie.'],
  };

  respostasCorretas: { [key: number]: string } = {
    1: 'joue',
    2: 'lances',
    3: 'court',
    4: 'faisons',
    5: 'lisez',
    6: 'chantent',
    7: 'dessine',
    8: 'prends',
    9: 'fait',
    10: 'jouons',
    11: 'attrapez',
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
