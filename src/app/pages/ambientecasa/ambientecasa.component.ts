import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { CrudAmbienteService } from '../../services/crudAmbiente.service';
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
  providers:[TransLetrasPipe,],
})
export class AmbientecasaComponent implements OnInit {
  personagemSelecionado: string | null = null;
  tempoVerbal: string = '';
  fundoImagem: string = '';
  mensagemFinalVisivel: boolean = false;

  @ViewChild('respostaInput') respostaInputRef!: ElementRef<HTMLInputElement>;

  fraseSelecionada: string | null = null;
  respostaDigitada: string = '';
  resultado: string | null = null;
  progresso: number = 0;
  totalPerguntas = 11;
  perguntaAtual: number | null = null;

  frases: { [key: number]: { frase: string, respostaCorreta: string } } = {
    1: { frase: 'Je ________ de l\'eau (boir).', respostaCorreta: 'bois' },
    2: { frase: 'Tu ________ le chat (voir).', respostaCorreta: 'vois' },
  };

  frasesAleatorias: { [key: number]: { frase: string, respostaCorreta: string }[] } = {
    1: [
      { frase: 'Je _____ du vin (boir).', respostaCorreta: 'bois' },
      { frase: 'Elle ______ un gâteau (manger).', respostaCorreta: 'mange' }
    ],
    2: [
      { frase: 'Il _________ un film (regarder).', respostaCorreta: 'regarde' },
      { frase: 'Nous _____ un chien (avoir).', respostaCorreta: 'avons' }
    ]
  };

  fraseAtual: { frase: string, respostaCorreta: string } | null = null;

  fraseExibida: { [key: number]: boolean } = {
    1: false,
    2: false
  };

  bolinhasEstado: { [key: number]: 'naoClicada' | 'clicada' | 'correta' | 'incorreta' } = {};
  acertos: number=0;

  constructor(
    private router: Router,
    private personagemService: PersonagemService,
    private crudService: CrudAmbienteService,
    private transLetrasPipe: TransLetrasPipe,
    private progressoService: ProgressoService,
    private ambientecasaService:AmbienteCasaService,
  ) {}

  ngOnInit(): void {
    this.personagemSelecionado = this.personagemService.getPersonagem();
    this.tempoVerbal = 'Présent'; // Simulação fixa, substitua se usar estado global
    this.fundoImagem = 'assets/imgs/fundo-casa.png';

    this.carregarFrasesAdicionais();

    for (let i = 1; i <= this.totalPerguntas; i++) {
      this.bolinhasEstado[i] = 'naoClicada';
    }
  }

  carregarFrasesAdicionais(): void {
    // Usando mock do serviço:
    this.crudService.getRespostasCertas().subscribe(frases => {
      for (let i = 3; i <= 11; i++) {
        this.frases[i] = {
          frase: frases[i - 3]?.frase || 'Frase padrão',
          respostaCorreta: frases[i - 3]?.resposta || '???'
        };
      }
    });
  }

  navigate(destino: string): void {
    this.router.navigate(['/' + destino]);
  }

  selecionarFrase(numero: number): void {
    this.respostaDigitada = '';
    this.resultado = null;
    this.perguntaAtual = numero;
    this.bolinhasEstado[numero] = 'clicada';

    if (numero === 1 || numero === 2) {
      if (!this.fraseExibida[numero]) {
        this.fraseExibida[numero] = true;
        this.fraseAtual = this.frases[numero];
      } else {
        const alternativas = this.frasesAleatorias[numero];
        const atual = this.fraseAtual?.frase;
        const nova = alternativas.find(f => f.frase !== atual) || alternativas[0];
        this.fraseAtual = nova;
      }
    } else {
      this.fraseAtual = this.frases[numero];
    }

    this.fraseSelecionada = this.fraseAtual?.frase || '';
    setTimeout(() => {
      this.respostaInputRef?.nativeElement.focus();
    });
  }

  
  verificarResposta(): void {
    if (this.perguntaAtual === null || !this.fraseAtual) return;
  
    const respostaCorreta = this.fraseAtual.respostaCorreta;
    const estaCorreta = this.ambientecasaService.verificarRespostaDigitada(
      this.respostaDigitada,
      respostaCorreta
    );
  
    if (estaCorreta) {
      this.acertos += 1;
      this.progresso = Math.min(this.progresso + (100 / this.totalPerguntas), 100);
      this.bolinhasEstado[this.perguntaAtual] = 'correta';
  
      if (this.perguntaAtual === 11) {
        if (this.acertos / this.totalPerguntas >= 0.6) {
          this.mensagemFinalVisivel = true;
          setTimeout(() => {
            this.router.navigate(['/ambienteparque']);
          }, 6000);
        } else {
          this.resultado = 'Você precisa de pelo menos 60% de acertos para avançar.';
        }
      } else {
        const proxima = this.perguntaAtual + 1;
        setTimeout(() => {
          this.selecionarFrase(proxima);
        }, 600);
      }
    } else {
      this.bolinhasEstado[this.perguntaAtual] = 'incorreta';
    }
  }
  
  

  getCorClasse(numero: number): string {
    const estado = this.bolinhasEstado[numero] || 'naoClicada';
    return numero === this.perguntaAtual ? `${estado} respondendo` : estado;
  }

  // Método para atualizar a resposta digitada com a transformação do pipe
  atualizarResposta(valor: string): void {
    this.respostaDigitada = this.transLetrasPipe.transform(valor);
  }
}
