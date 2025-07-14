import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { PersonagemService } from '../../services/personagem.service';
import { TransLetrasPipe } from '../../trans-letras.pipe';
import { ProgressoService } from '../../services/progresso.service';
import { AmbienteParqueService, Frase } from '../../services/ambiente-parque.service';
import { JogoService } from '../../services/jogo.service';
import { JogadorService } from 'src/app/services/jogador.service';

@Component({
  selector: 'app-ambientecasa',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, TransLetrasPipe],
  templateUrl: './ambienteparque.component.html',
  styleUrls: ['./ambienteparque.component.css'],
  providers: [TransLetrasPipe],
})
export class AmbienteparqueComponent implements OnInit {
  personagemSelecionado: string | null = null;
  tempoVerbal: string = 'Présent';
  fundoImagem: string = 'assets/vvimagens/fundo-parque.png';
  mensagemFinalVisivel: boolean = false;
  tentativas: { [key: number]: number } = {};
  respostaDigitada: string = '';
  resultado: string | null = null;
  progresso: number = 0;
  progressoParque: number = 0;
  totalPerguntas = 11;
  perguntaAtual: number | null = null;
  frasesAleatorias: { [key: number]: Frase[] } = {};
  fraseAtual: Frase | null = null;
  fraseSelecionada: string | null = null;
  fraseExibida: { [key: number]: boolean } = {};
  bolinhasEstado: { [key: number]: 'naoClicada' | 'clicada' | 'correta' | 'incorreta' } = {};
  acertos: number = 0;
  usuarioNome: string = 'Utilisateur';
  personagemImagem: string = 'assets/vvimagens/usuario2.png';
  voices: SpeechSynthesisVoice[] = [];
  destino: string = 'ambienteuniversidade';

  @ViewChild('respostaInput') respostaInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private jogadorService: JogadorService,
    private personagemService: PersonagemService,
    private transLetrasPipe: TransLetrasPipe,
    private progressoService: ProgressoService,
    private ambienteParqueService: AmbienteParqueService,
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

    this.voices = speechSynthesis.getVoices();
    this.carregarFrases();
    this.progressoParque = this.progressoService.getProgresso('parque');
  }

  carregarFrases(): void {
    this.ambienteParqueService.getFrasesParque()
      .then((frases: Frase[]) => {
        for (let i = 1; i <= this.totalPerguntas; i++) {
          const index = 21 + i;
          this.frasesAleatorias[i] = [
            frases[index] || { frase: `Frase ${i}-A`, respostaCorreta: '???' },
            frases[index + 11] || { frase: `Frase ${i}-B`, respostaCorreta: '???' }
          ];
        }
        this.selecionarFrase(1);
      })
      .catch(error => console.error('Erro ao carregar frases:', error));
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

    const estaCorreta = this.ambienteParqueService.verificarRespostaDigitada(
      this.respostaDigitada,
      this.fraseAtual.respostaCorreta
    );

    if (estaCorreta) {
      this.bolinhasEstado[numero] = 'correta';
      this.acertos += 1;
      this.progresso = Math.min((this.acertos / this.totalPerguntas) * 100, 100);
      this.progressoService.setProgresso('parque', this.progresso);
      this.tentativas[numero] = 0;

      this.resultado = `🎉 Félicitations, ${this.usuarioNome} ! La bonne réponse est : "${this.fraseAtual.respostaCorreta}"`;

      if (numero === this.totalPerguntas) {
        this.finalizarJogoParque();
      }
    } else {
      this.tentativas[numero] = (this.tentativas[numero] || 0) + 1;

      if (this.tentativas[numero] < 2) {
        this.resultado = `❌ Vous pouvez réessayer. Tentative ${this.tentativas[numero]} de 2.`;
      } else {
        this.bolinhasEstado[numero] = 'incorreta';
        this.resultado = `❌ La réponse correcte est : "${this.fraseAtual.respostaCorreta}".`;

        if (numero === this.totalPerguntas) {
          setTimeout(() => this.finalizarJogoParque(), 3000);
        }
      }
    }
  }

  async finalizarJogoParque(): Promise<void> {
    this.mensagemFinalVisivel = true;
    const dataAtual = new Date().toISOString().split('T')[0];
    const acertosCasa = parseInt(localStorage.getItem('acertos_casa') || '0', 10);

    const resultadoParque = {
      personagem: this.personagemSelecionado || 'Anonyme',
      acertosCasa: acertosCasa,
      acertosParque: this.acertos,
      acertosUniversidade: 0,
      totalAcertos: acertosCasa + this.acertos,
      data: dataAtual,
      nomeUsuario: this.usuarioNome
    };

    let prev = JSON.parse(localStorage.getItem('ultimoResultadoJogo') || '[]');
    prev.push(resultadoParque);
    localStorage.setItem('ultimoResultadoJogo', JSON.stringify(prev));

    localStorage.setItem('acertos_parque', this.acertos.toString());

    setTimeout(() => this.router.navigate(['/ambienteuniversidade']), 6000);
  }

  getCorClasse(numero: number): string {
    const estado = this.bolinhasEstado[numero] || 'naoClicada';
    return (estado === 'correta' || estado === 'incorreta')
      ? estado
      : numero === this.perguntaAtual ? `${estado} respondendo` : estado;
  }

  atualizarResposta(valor: string): void {
    this.respostaDigitada = this.transLetrasPipe.transform(valor);
  }

  navigate(destino: string): void {
    this.router.navigate(['/ambienteuniversidade']);
  }

  navi(destino: string): void {
    this.router.navigate(['/ambientecasa']);
  }
}
