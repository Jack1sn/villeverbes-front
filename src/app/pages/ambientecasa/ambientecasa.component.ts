import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
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
    private jogadorService: JogadorService,
    private personagemService: PersonagemService,
    private transLetrasPipe: TransLetrasPipe,
    private progressoService: ProgressoService,
    private ambientecasaService: AmbienteCasaService,
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
    this.progressoCasa = this.progressoService.getProgresso('casa');
  }

  carregarFrases(): void {
    this.ambientecasaService.getFrasesCasa()
      .then((frases: Frase[]) => {
        for (let i = 1; i <= this.totalPerguntas; i++) {
          const index = (i - 1) * 2;
          this.frasesAleatorias[i] = [
            frases[index] || { frase: `Frase ${i}-A`, respostaCorreta: '???' },
            frases[index + 1] || { frase: `Frase ${i}-B`, respostaCorreta: '???' }
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

    const estaCorreta = this.ambientecasaService.verificarRespostaDigitada(
      this.respostaDigitada,
      this.fraseAtual.respostaCorreta
    );

    if (estaCorreta) {
      this.bolinhasEstado[numero] = 'correta';
      this.acertos += 1;
      console.log('Incrementou acertos:', this.acertos);
      this.progresso = Math.min((this.acertos / this.totalPerguntas) * 100, 100);
      this.progressoService.setProgresso('casa', this.progresso);
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
        this.resultado = `❌ Vous pouvez réessayer. Tentative ${this.tentativas[numero]} de 2.`;
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
      }
    }
  }

async finalizarJogo(): Promise<void> {
  console.log('Finalizando jogo. Acertos:', this.acertos);

  this.mensagemFinalVisivel = true;

  // Obter a data atual no formato YYYY-MM-DD
  const dataAtual = new Date().toISOString().split('T')[0];

  // Definir o objeto de resultado final
  const resultadoFinal = {
    personagem: this.personagemSelecionado || 'Anonyme',
    acertoCasa: this.acertos,
    acertoParque: 0,
    acertoUniversidade: 0,
    totalAcertos: this.acertos,
    data: dataAtual
  };

  console.log('Resultado final para armazenar:', resultadoFinal);

  // Recuperar o usuarioId (exemplo: do localStorage ou de um serviço)
  const usuarioId = localStorage.getItem('usuarioId');
  if (!usuarioId) {
    console.error('Usuário não encontrado. Não foi possível salvar o resultado.');
    return;
  }

  try {
    // Verificar se os dados anteriores no localStorage são um array válido
    let dadosAnteriores = localStorage.getItem('ultimoResultadoJogo');
    let resultadosSalvos = [];
    
    // Se dadosAnteriores existir, tentar fazer o parse e garantir que seja um array
    if (dadosAnteriores) {
      try {
        resultadosSalvos = JSON.parse(dadosAnteriores);
        if (!Array.isArray(resultadosSalvos)) {
          resultadosSalvos = []; // Se não for um array, reiniciar como array vazio
        }
      } catch (e) {
        console.error('Erro ao ler os resultados anteriores do localStorage:', e);
        resultadosSalvos = []; // Em caso de erro no parse, reiniciar como array vazio
      }
    }

    // Adicionar o novo resultado
    resultadosSalvos.push(resultadoFinal);

    // Salvar novamente no localStorage
    localStorage.setItem('ultimoResultadoJogo', JSON.stringify(resultadosSalvos));

    console.log('Resultado salvo no localStorage:', localStorage.getItem('ultimoResultadoJogo'));

    // Enviar para o banco de dados
    await this.jogoService.salvarResultadoJogo(Number(usuarioId), resultadoFinal);
    console.log('Resultado salvo no banco de dados com sucesso!');

  } catch (error) {
    console.error('Erro ao salvar no localStorage ou enviar para o banco:', error);
  }

  // Navegar para outra tela após 6 segundos
  setTimeout(() => {
    console.log('Navegando para /ambienteparque');
    this.router.navigate(['/ambienteparque']);
  }, 6000);
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

  
}
