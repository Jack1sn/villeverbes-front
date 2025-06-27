import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { PersonagemService } from '../../services/personagem.service';
import { ProgressoService } from '../../services/progresso.service';
import { AmbienteUniversidadeService, Frase } from '../../services/ambiente-universidade.service';
import { JogoService } from '../../services/jogo.service';
import { JogadorService } from 'src/app/services/jogador.service';
import { JogoData } from 'src/app/models/jogo-data.model';

@Component({
  selector: 'app-ambienteuniversidade',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './ambienteuniversidade.component.html',
  styleUrls: ['./ambienteuniversidade.component.css'],
})
export class AmbienteuniversidadeComponent implements OnInit {
  personagemSelecionado: string | null = null;
   tempoVerbal: string = 'Présent';
  usuarioNome: string = 'Utilisateur';
  personagemImagem: string = 'assets/vvimagens/usuario2.png';
  respostaDigitada = '';
  resultado: string | null = null;
  progresso = 0;
  totalPerguntas = 11;
  perguntaAtual: number | null = null;
  frasesAleatorias: { [key: number]: Frase[] } = {};
  fraseAtual: Frase | null = null;
  fraseSelecionada: string | null = null;
  fraseExibida: { [key: number]: boolean } = {};
  bolinhasEstado: { [key: number]: 'naoClicada' | 'clicada' | 'correta' | 'incorreta' } = {};
  tentativas: { [key: number]: number } = {};
  acertos = 0;
  mensagemFinalVisivel = false;

  @ViewChild('respostaInput') respostaInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private jogadorService: JogadorService,
    private personagemService: PersonagemService,
    private progressoService: ProgressoService,
    private ambienteUniversidadeService: AmbienteUniversidadeService,
    private jogoService: JogoService
  ) {}

  ngOnInit(): void {
    this.personagemSelecionado = this.personagemService.getPersonagem();
    const nomeSalvo = localStorage.getItem('usuarioNome');
    const imagemSalva = localStorage.getItem('usuarioImagem');
    if (nomeSalvo) this.usuarioNome = nomeSalvo;
    if (imagemSalva) this.personagemImagem = imagemSalva;

    for (let i = 1; i <= this.totalPerguntas; i++) {
      this.bolinhasEstado[i] = 'naoClicada';
    }

    this.carregarFrases();
    this.progresso = this.progressoService.getProgresso('universidade');
  }

  carregarFrases(): void {
    this.ambienteUniversidadeService.getFrasesUniversidade()
      .then((frases: Frase[]) => {
        for (let i = 1; i <= this.totalPerguntas; i++) {
          const index = 22 + (i - 1) * 2; // Pega frases de índice 22 a 43 => 23ª a 44ª
          this.frasesAleatorias[i] = [
            frases[index] || { frase: `Frase ${i}-A`, respostaCorreta: '???' },
            frases[index + 1] || { frase: `Frase ${i}-B`, respostaCorreta: '???' }
          ];
        }

        this.selecionarFrase(1);
      })
      .catch(err => console.error('Erro ao carregar frases universidade:', err));
  }

  perguntasArray(): number[] {
    return Array.from({ length: this.totalPerguntas }, (_, i) => i + 1);
  }

  selecionarFrase(numero: number): void {
    this.respostaDigitada = '';
    this.resultado = null;
    this.perguntaAtual = numero;
    this.bolinhasEstado[numero] = 'clicada';

    const alternativas = this.frasesAleatorias[numero];
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

    const numero = this.perguntaAtual;
    if (this.bolinhasEstado[numero] === 'correta' || this.bolinhasEstado[numero] === 'incorreta') return;

    const estaCorreta = this.ambienteUniversidadeService.verificarRespostaDigitada(
      this.respostaDigitada,
      this.fraseAtual.respostaCorreta
    );

    if (estaCorreta) {
      this.bolinhasEstado[numero] = 'correta';
      this.acertos += 1;
      this.progresso = Math.min((this.acertos / this.totalPerguntas) * 100, 100);
      this.progressoService.setProgresso('universidade', this.progresso);
      this.tentativas[numero] = 0;

      setTimeout(() => {
        this.resultado = `🎉 Félicitations, ${this.usuarioNome} ! La bonne réponse est : "${this.fraseAtual!.respostaCorreta}"`;

        if (numero === this.totalPerguntas) {
          this.finalizarJogo();
        } else {
          setTimeout(() => this.selecionarFrase(numero + 1), 1000);
        }
      }, 1000);
    } else {
      this.tentativas[numero] = (this.tentativas[numero] || 0) + 1;

      if (this.tentativas[numero] < 2) {
        this.resultado = `❌ Désolé, vous pouvez essayer de nouveau. Tentative ${this.tentativas[numero]} de 2.`;
      } else {
        this.bolinhasEstado[numero] = 'incorreta';
        this.resultado = `❌ La réponse correcte est : "${this.fraseAtual.respostaCorreta}".`;

        setTimeout(() => {
          if (numero === this.totalPerguntas) {
            this.finalizarJogo();
          } else {
            this.selecionarFrase(numero + 1);
          }
        }, 3000);

        this.tentativas[numero] = 0;
      }
    }
  }

  finalizarJogo(): void {
    if (this.acertos / this.totalPerguntas >= 0.6) {
      this.mensagemFinalVisivel = true;
      this.enviarResultadoParaBanco();
      setTimeout(() => this.router.navigate(['/outro-ambiente-ou-final']), 6000);
    } else {
      this.resultado = 'Você precisa de pelo menos 60% de acertos para avançar.';
    }
  }

  async enviarResultadoParaBanco(): Promise<void> {
    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) {
      console.error('Erro: Usuario ID não encontrado');
      return;
    }

    const jogoData: JogoData = {
      personagem: this.personagemSelecionado,
      ambiente: 'universidade',
      acertos: this.acertos,
      total: this.totalPerguntas,
      acertoPorAmbiente: `${this.acertos} de ${this.totalPerguntas}`,
      nomeUsuario: this.usuarioNome,
    };

    try {
      await this.jogoService.salvarResultadoJogo(+usuarioId, jogoData);
    } catch (error) {
      console.error('❌ Falha ao enviar o resultado para o backend.', error);
    }
  }

  getCorClasse(numero: number): string {
    const estado = this.bolinhasEstado[numero] || 'naoClicada';
    return (estado === 'correta' || estado === 'incorreta')
      ? estado
      : numero === this.perguntaAtual ? `${estado} respondendo` : estado;
  }

  navigate(destino: string): void {
    this.router.navigate(['/' + destino]);
  }
}
