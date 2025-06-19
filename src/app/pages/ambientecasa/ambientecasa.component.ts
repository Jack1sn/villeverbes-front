import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { PersonagemService } from '../../services/personagem.service';
import { TransLetrasPipe } from '../../trans-letras.pipe';
import { ProgressoService } from '../../services/progresso.service';
import { AmbienteCasaService, Frase } from '../../services/ambientecasa.service';
import { JogoData } from '../../models/jogo-data.model'; // Importando o modelo JogoData
import axios from 'axios'; // Importando o Axios

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
  tentativas: { [key: number]: number } = {};
  respostaDigitada: string = '';
  resultado: string | null = null;
  progresso: number = 0;
  progressoCasa: number = 0;
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

  @ViewChild('respostaInput') respostaInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private personagemService: PersonagemService,
    private transLetrasPipe: TransLetrasPipe,
    private progressoService: ProgressoService,
    private ambientecasaService: AmbienteCasaService
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
    this.progressoCasa = this.progressoService.getProgresso('casa');
  }

  carregarFrases(): void {
    this.ambientecasaService.getFrasesCasa()
      .then((frases: Frase[]) => {
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

    const estaCorreta = this.ambientecasaService.verificarRespostaDigitada(
      this.respostaDigitada,
      this.fraseAtual.respostaCorreta
    );

    if (estaCorreta) {
      this.bolinhasEstado[numero] = 'correta';
      this.acertos += 1;
      this.progresso = Math.min((this.acertos / this.totalPerguntas) * 100, 100);
      this.progressoService.setProgresso('casa', this.progresso);
      this.tentativas[numero] = 0;

      setTimeout(() => {
        this.resultado = `🎉 Félicitations, ${this.usuarioNome} ! La bonne réponse est : "${this.fraseAtual!.respostaCorreta}"`;

        if (numero === this.totalPerguntas) {
          if (this.acertos / this.totalPerguntas >= 0.6) {
            this.mensagemFinalVisivel = true;
            this.enviarResultadoParaBanco();
            setTimeout(() => this.router.navigate(['/ambienteparque']), 6000);
          } else {
            this.resultado = 'Você precisa de pelo menos 60% de acertos para avançar.';
          }
        } else {
          setTimeout(() => this.selecionarFrase(numero + 1), 8000);
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
            if (this.acertos / this.totalPerguntas >= 0.6) {
              this.mensagemFinalVisivel = true;
              this.enviarResultadoParaBanco();
              setTimeout(() => this.router.navigate(['/ambienteparque']), 6000);
            } else {
              this.resultado = 'Você precisa de pelo menos 60% de acertos para avançar.';
            }
          } else {
            this.selecionarFrase(numero + 1);
          }
        }, 3000);

        this.tentativas[numero] = 0;
      }
    }
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
    this.router.navigate(['/' + destino]);
  }

  async enviarResultadoParaBanco(): Promise<void> {
    const usuarioId = localStorage.getItem('usuarioId'); // Recuperando ID do usuário

    if (!usuarioId) {
      console.error('Erro: Usuario ID não encontrado');
      return;
    }

    const jogoData = {
      personagem: this.personagemSelecionado,
      ambiente: 'casa',
      acertos: this.acertos,
      total: this.totalPerguntas,
      acertoPorAmbiente: `${this.acertos} de ${this.totalPerguntas}`,
      data: new Date().toISOString(),
      nomeUsuario: this.usuarioNome,
    };

    try {
      console.log('📤 Enviando dados do jogo:', jogoData);

      // Envio dos dados para a API
      const response = await axios.post(
        `http://localhost:8080/api/jogo/${usuarioId}`, jogoData
      );

      console.log('Resultado do jogo salvo com sucesso:', response.data);
    } catch (error: any) {
      console.error('Erro ao salvar o resultado do jogo:', error);
      if (error.response) {
        console.error('Erro na resposta da API:', error.response.data);
      } else if (error.request) {
        console.error('Erro na requisição:', error.request);
      } else {
        console.error('Erro desconhecido:', error.message);
      }
    }
  }
}
