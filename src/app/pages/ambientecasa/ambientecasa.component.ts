import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { PersonagemService } from '../../services/personagem.service';
import { TransLetrasPipe } from '../../trans-letras.pipe';
import { ProgressoService } from '../../services/progresso.service';
import { AmbienteCasaService } from '../../services/ambientecasa.service';

@Component({
  selector: 'app-ambientecasa',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, TransLetrasPipe],
  templateUrl: './ambientecasa.component.html',
  styleUrls: ['./ambientecasa.component.css'],
  providers: [TransLetrasPipe],
})
export class AmbientecasaComponent implements OnInit {
  personagemSelecionado: string | null = null;
  tempoVerbal: string = 'Présent';
  fundoImagem: string = 'assets/vvimagens/fundo-casa.png';
  mensagemFinalVisivel: boolean = false;

  @ViewChild('respostaInput') respostaInputRef!: ElementRef<HTMLInputElement>;

  respostaDigitada: string = '';
  resultado: string | null = null;
  progresso: number = 0;
  totalPerguntas = 11;
  perguntaAtual: number | null = null;

  frasesAleatorias: { [key: number]: { frase: string; respostaCorreta: string }[] } = {};
  fraseAtual: { frase: string; respostaCorreta: string } | null = null;
  fraseSelecionada: string | null = null;

  fraseExibida: { [key: number]: boolean } = {};
  bolinhasEstado: { [key: number]: 'naoClicada' | 'clicada' | 'correta' | 'incorreta' } = {};
  acertos: number = 0;

  constructor(
    private router: Router,
    private personagemService: PersonagemService,
    private transLetrasPipe: TransLetrasPipe,
    private progressoService: ProgressoService,
    private ambientecasaService: AmbienteCasaService,
  ) {}

  ngOnInit(): void {
    this.personagemSelecionado = this.personagemService.getPersonagem();

    for (let i = 1; i <= this.totalPerguntas; i++) {
      this.bolinhasEstado[i] = 'naoClicada';
    }

    this.carregarFrases();
  }

carregarFrases(): void {
  this.ambientecasaService.getFrasesCasa().subscribe(frases => {
    console.log('📥 Frases recebidas:', frases);

    if (frases.length < this.totalPerguntas * 2) {
      console.warn('⚠️ Frases insuficientes para todas as perguntas, completando com padrão.');
    }

    for (let i = 1; i <= this.totalPerguntas; i++) {
      const index = (i - 1) * 2;
      this.frasesAleatorias[i] = [
        frases[index] || { frase: `Frase padrão ${i}-A`, respostaCorreta: '???' },
        frases[index + 1] || { frase: `Frase padrão ${i}-B`, respostaCorreta: '???' }
      ];
    }

    this.fraseAtual = this.frasesAleatorias[1][0];
    this.fraseSelecionada = this.fraseAtual.frase;
    this.fraseExibida[1] = true;

    this.selecionarFrase(1); // <- chama após preenchimento garantido
  });
}


  selecionarFrase(numero: number): void {
  this.respostaDigitada = '';
  this.resultado = null;
  this.perguntaAtual = numero;
  this.bolinhasEstado[numero] = 'clicada';

  const alternativas = this.frasesAleatorias[numero];

  if (!alternativas || alternativas.length < 2) {
    console.error(`❌ Erro: Frases não carregadas corretamente para a pergunta ${numero}`);
    this.fraseAtual = {
      frase: `Frase padrão ${numero}`,
      respostaCorreta: '???'
    };
    this.fraseSelecionada = this.fraseAtual.frase;
    return;
  }

  const exibidaAnteriormente = this.fraseExibida[numero] ?? false;
  this.fraseAtual = exibidaAnteriormente ? alternativas[1] : alternativas[0];
  this.fraseSelecionada = this.fraseAtual.frase;
  this.fraseExibida[numero] = !exibidaAnteriormente;

  setTimeout(() => {
    this.respostaInputRef?.nativeElement.focus();
  });
}


  verificarResposta(): void {
    if (this.perguntaAtual === null || !this.fraseAtual) return;

    const estaCorreta = this.ambientecasaService.verificarRespostaDigitada(
      this.respostaDigitada,
      this.fraseAtual.respostaCorreta
    );

    if (estaCorreta) { this.resultado = 'Félicitations!';
      this.acertos += 1;
      this.progresso = Math.min(this.progresso + (100 / this.totalPerguntas), 100);
      this.bolinhasEstado[this.perguntaAtual] = 'correta';

      if (this.perguntaAtual === this.totalPerguntas) {
        if (this.acertos / this.totalPerguntas >= 0.6) {
          this.mensagemFinalVisivel = true;
          setTimeout(() => this.router.navigate(['/ambienteparque']), 6000);
        } else {
          this.resultado = 'Você precisa de pelo menos 60% de acertos para avançar.';
        }
      } else {
        setTimeout(() => {
          this.selecionarFrase(this.perguntaAtual! + 1);
        }, 600);
      }
    } else {
      this.resultado = 'Désolé, vous pouvez essayer de nouveau.';
      this.bolinhasEstado[this.perguntaAtual] = 'incorreta';
    }
  }

  getCorClasse(numero: number): string {
    const estado = this.bolinhasEstado[numero] || 'naoClicada';
    return numero === this.perguntaAtual ? `${estado} respondendo` : estado;
  }

  atualizarResposta(valor: string): void {
    this.respostaDigitada = this.transLetrasPipe.transform(valor);
  }

  navigate(destino: string): void {
    this.router.navigate(['/' + destino]);
  }
}
