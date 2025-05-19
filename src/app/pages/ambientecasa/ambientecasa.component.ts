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
  providers: [TransLetrasPipe],
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

  frases: { [key: number]: { frase: string, respostaCorreta: string } } = {};
  frasesAleatorias: { [key: number]: { frase: string, respostaCorreta: string }[] } = {};

  fraseAtual: { frase: string, respostaCorreta: string } | null = null;

  fraseExibida: { [key: number]: boolean } = {};
  bolinhasEstado: { [key: number]: 'naoClicada' | 'clicada' | 'correta' | 'incorreta' } = {};
  acertos: number = 0;

  constructor(
    private router: Router,
    private personagemService: PersonagemService,
    private crudService: CrudAmbienteService,
    private transLetrasPipe: TransLetrasPipe,
    private progressoService: ProgressoService,
    private ambientecasaService: AmbienteCasaService,
  ) {}

  ngOnInit(): void {
    this.personagemSelecionado = this.personagemService.getPersonagem();
    this.tempoVerbal = 'Présent'; // Simulação fixa, substitua se usar estado global
    this.fundoImagem = 'assets/imgs/fundo-casa.png';

    this.carregarFrasesAdicionais();

    // Inicializa o estado das bolinhas
    for (let i = 1; i <= this.totalPerguntas; i++) {
      this.bolinhasEstado[i] = 'naoClicada';
    }
  }

  carregarFrasesAdicionais(): void {
    this.crudService.getRespostasCertas().subscribe(frases => {
      console.log('Frases da API:', frases);
      
      // Verifica se a API retornou frases e usa fallback para a primeira questão
      if (frases && frases.length > 0) {
        // Garantir que a questão 1 tenha uma resposta válida
        this.frases[1] = {
          frase: frases[0].frase || 'Frase padrão',
          respostaCorreta: frases[0].resposta || '???'
        };
  
        // Preenche o restante das frases
        for (let i = 1; i < frases.length && i < this.totalPerguntas; i++) {
          this.frases[i + 1] = {
            frase: frases[i].frase || 'Frase padrão',
            respostaCorreta: frases[i].resposta || '???'
          };
        }
  
        this.fraseAtual = this.frases[1];
        this.selecionarFrase(1);
      } else {
        console.warn('Nenhuma frase foi retornada pela API, usando questões padrão');
        
        // Fallback: Adiciona a primeira questão manualmente
        this.frases[1] = {
          frase: 'je _____(laver) mes yeux',
          respostaCorreta: 'lave'
        };
  
        // Adiciona outras frases padrão, se necessário
        for (let i = 2; i <= this.totalPerguntas; i++) {
          this.frases[i] = {
            frase: `Frase padrão para a questão ${i}`,
            respostaCorreta: '???'
          };
        }
  
        this.fraseAtual = this.frases[1];
        this.selecionarFrase(1);
      }
    }, (error) => {
      console.error('Erro ao carregar as frases:', error);
      
      // Caso haja erro na requisição, use frases padrão
      this.frases[1] = {
        frase: 'je_____(parler) français .',
        respostaCorreta: 'parle'
      };
      
      // Preencher outras frases como padrão
      for (let i = 2; i <= this.totalPerguntas; i++) {
        this.frases[i] = {
          frase: `Frase padrão para a questão ${i}`,
          respostaCorreta: '???'
        };
      }
  
      this.fraseAtual = this.frases[1];
      this.selecionarFrase(1);
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
