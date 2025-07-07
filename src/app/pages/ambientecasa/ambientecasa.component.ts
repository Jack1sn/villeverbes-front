import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { PersonagemService } from '../../services/personagem.service';
import { TransLetrasPipe } from '../../trans-letras.pipe';
import { ProgressoService } from '../../services/progresso.service';
import { AmbienteCasaService, Frase } from '../../services/ambientecasa.service';
import { JogoService } from '../../services/jogo.service';
import { JogadorService } from 'src/app/services/jogador.service';

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
  tempoVerbal = 'Présent';
  fundoImagem = '';
  mensagemFinalVisivel = false;
  tentativas: { [key: number]: number } = {};
  respostaDigitada = '';
  resultado: string | null = null;
  progresso = 0;
  progressoCasa = 0;
  totalPerguntas = 11;
  perguntaAtual: number | null = null;
  frasesAleatorias: { [key: number]: Frase[] } = {};
  fraseAtual: Frase | null = null;
  fraseSelecionada: string | null = null;
  fraseExibida: { [key: number]: boolean } = {};
  bolinhasEstado: { [key: number]: 'naoClicada' | 'clicada' | 'correta' | 'incorreta' } = {};
  acertos = 0;
  usuarioNome: string = 'Utilisateur';
  personagemImagem = 'assets/vvimagens/usuario2.png';
  voices: SpeechSynthesisVoice[] = [];
  dest='ambienteparque';


  @ViewChild('respostaInput') respostaInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private jogadorService: JogadorService,
    private personagemService: PersonagemService,
    private transLetrasPipe: TransLetrasPipe,
    private progressoService: ProgressoService,
    private ambientecasaService: AmbienteCasaService,
    private jogoService: JogoService
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => this.definirFundo());
    this.definirFundo();

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
    this.progressoCasa = this.progressoService.getProgresso('casa');
  }

  definirFundo(): void {
    const url = this.router.url;
    if (url.includes('ambientecasa')) {
      this.fundoImagem = 'assets/vvimagens/ambientecasa.jpg';
    } else if (url.includes('ambienteparque')) {
      this.fundoImagem = 'assets/vvimagens/fundo-parque.png';
    } else if (url.includes('ambienteuniversidade')) {
      this.fundoImagem = 'assets/vvimagens/fundo-universidade.png';
    } else {
      this.fundoImagem = '';
    }
  }

  carregarFrases(): void {
    this.ambientecasaService.getFrasesCasa()
      .then(frases => {
        for (let i = 1; i <= this.totalPerguntas; i++) {
          const idx = (i - 1) * 2;
          this.frasesAleatorias[i] = [
            frases[idx] || { frase: `Frase ${i}-A`, respostaCorreta: '???' },
            frases[idx + 1] || { frase: `Frase ${i}-B`, respostaCorreta: '???' }
          ];
        }
        this.selecionarFrase(1);
      })
      .catch(err => console.error('Erro ao carregar frases:', err));
  }

  selecionarFrase(numero: number): void {
    this.perguntaAtual = numero;
    this.respostaDigitada = '';
    this.resultado = null;
    this.bolinhasEstado[numero] = 'clicada';

    const alt = this.frasesAleatorias[numero];
    const used = this.fraseExibida[numero] ?? false;
    this.fraseAtual = used ? alt[1] : alt[0];
    this.fraseSelecionada = this.fraseAtual.frase;
    this.fraseExibida[numero] = !used;

    setTimeout(() => this.respostaInputRef.nativeElement.focus());
  }

  verificarResposta(): void {
    if (this.perguntaAtual == null || !this.fraseAtual) return;

    const num = this.perguntaAtual;
    if (['correta', 'incorreta'].includes(this.bolinhasEstado[num])) return;

    const correta = this.ambientecasaService.verificarRespostaDigitada(
      this.respostaDigitada, this.fraseAtual.respostaCorreta
    );

    if (correta) {
      this.bolinhasEstado[num] = 'correta';
      this.acertos++;
      this.progresso = Math.min((this.acertos / this.totalPerguntas) * 100, 100);
      this.progressoService.setProgresso('casa', this.progresso);
      this.tentativas[num] = 0;

      setTimeout(() => {
        this.resultado = `🎉 Félicitations, ${this.usuarioNome}! La bonne réponse: "${this.fraseAtual!.respostaCorreta}"`;
        num === this.totalPerguntas ? this.finalizarJogoCasa() : setTimeout(() => this.selecionarFrase(num + 1), 1000);
      }, 1000);
    } else {
      this.tentativas[num] = (this.tentativas[num] || 0) + 1;
      if (this.tentativas[num] < 2) {
        this.resultado = `❌ Vous pouvez réessayer. Tentative ${this.tentativas[num]} de 2.`;
      } else {
        this.bolinhasEstado[num] = 'incorreta';
        this.resultado = `❌ La réponse correcte: "${this.fraseAtual.respostaCorreta}".`;
        setTimeout(() => num === this.totalPerguntas ? this.finalizarJogoCasa() : this.selecionarFrase(num + 1), 3000);
        this.tentativas[num] = 0;
      }
    }
  }

  async finalizarJogoCasa(): Promise<void> {
  console.log('Valor de acertos na casa:', this.acertos);

  // Exibir a mensagem final
  this.mensagemFinalVisivel = true;

  // Obter a data atual
  const dataAtual = new Date().toISOString().split('T')[0];

  // Criar o objeto de resultado para o ambiente Casa
  const resultadoCasa = {
    personagem: this.personagemSelecionado || 'Anonyme',
    acertosCasa: this.acertos,
    acertosParque: 0,  // Não há acertos no Parque ainda
    acertosUniversidade: 0,  // Não há acertos na Universidade ainda
    totalAcertos: this.acertos,  // Total de acertos só no ambiente Casa
    data: dataAtual,
    nomeUsuario: this.usuarioNome
  };

  // Salvar o resultado no localStorage
  let prev = JSON.parse(localStorage.getItem('ultimoResultadoJogo') || '[]');
  prev.push(resultadoCasa);
  localStorage.setItem('ultimoResultadoJogo', JSON.stringify(prev));

  localStorage.setItem('acertos_casa', this.acertos.toString());

  // Redirecionar para o próximo ambiente (Parque)
  setTimeout(() => this.router.navigate(['/ambienteparque']), 6000);
}


  getCorClasse(i: number): string {
    const est = this.bolinhasEstado[i] || 'naoClicada';
    return ['correta','incorreta'].includes(est) ? est : (i === this.perguntaAtual ? `${est} respondendo` : est);
  }

  atualizarResposta(v: string): void {
    this.respostaDigitada = this.transLetrasPipe.transform(v);
  }
  
  navigate(dest: string): void {
    this.router.navigate(['/ambienteparque']);
  }
  

}
