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
  respostaDigitada: string = '';
  resultado: string | null = null;
  progresso: number = 0;
  totalPerguntas: number = 11;
  perguntaAtual: number | null = null;
  frasesAleatorias: { [key: number]: Frase[] } = {};
  fraseAtual: Frase | null = null;
  fraseSelecionada: string | null = null;
  fraseExibida: { [key: number]: boolean } = {};
  bolinhasEstado: { [key: number]: 'naoClicada' | 'clicada' | 'correta' | 'incorreta' } = {};
  tentativas: { [key: number]: number } = {};
  acertos: number = 0;
  mensagemFinalVisivel: boolean = false;
  destino: string = 'ambientecasa';

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
      for (let i = 1; i <= 11; i++) {  // Garantindo 11 questões no total
        // Cálculo do índice da primeira frase conforme o padrão (46, 47, 48, ...)
        const index = 45 + i;  // Para 46, 47, 48, etc.
        
        // Atribuindo as frases de acordo com os índices calculados
        this.frasesAleatorias[i] = [
          frases[index] || { frase: `Frase ${i}-A`, respostaCorreta: '???' },
          frases[index + 9] || { frase: `Frase ${i}-B`, respostaCorreta: '???' }  // Pegando a segunda frase com +9 (46 + 9 = 55)
        ];
      }
      this.selecionarFrase(1);
    })
    .catch(error => console.error('Erro ao carregar frases universidade:', error));
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
async finalizarJogo(): Promise<void> {
  const acertosCasa = parseInt(localStorage.getItem('acertos_casa') || '0', 10);
  const acertosParque = parseInt(localStorage.getItem('acertos_parque') || '0', 10);
  const acertosUniversidade = this.acertos;

  const totalAcertos = acertosCasa + acertosParque + acertosUniversidade;
  const dataAtual = new Date().toISOString().split('T')[0];

  const resultadoFinal: JogoData = {
    personagem: this.personagemSelecionado || 'Anonyme',
    acertosCasa,
    acertosParque,
    acertosUniversidade,
    totalAcertos,
    data: dataAtual,
    nomeUsuario: this.usuarioNome
  };

  console.log('Resultado final:', resultadoFinal);

  // Recupera e atualiza o histórico local
  const resultadosSalvos: JogoData[] = JSON.parse(localStorage.getItem('ultimoResultadoJogo') || '[]');
  resultadosSalvos.push(resultadoFinal);
  localStorage.setItem('ultimoResultadoJogo', JSON.stringify(resultadosSalvos));

  // Envia todos os resultados salvos para o banco
  const usuarioId = localStorage.getItem('usuarioId');
  if (!usuarioId) {
    console.error('Erro: Usuario ID não encontrado');
    return;
  }

  try {
    await this.jogoService.salvarResultadosDeTodosOsJogos(+usuarioId, resultadosSalvos);
    console.log('Todos os resultados salvos no banco de dados!');
  } catch (error) {
    console.error('Erro ao salvar resultados no banco:', error);
  }

  // Limpa dados temporários, mas mantém o histórico
  localStorage.removeItem('acertos_casa');
  localStorage.removeItem('acertos_parque');
  localStorage.removeItem('acertos_universidade');

  // Redireciona após 6 segundos
  setTimeout(() => {
    this.router.navigate(['/home']);
  }, 6000);
}




  getCorClasse(numero: number): string {
    const estado = this.bolinhasEstado[numero] || 'naoClicada';
    return (estado === 'correta' || estado === 'incorreta')
      ? estado
      : numero === this.perguntaAtual ? `${estado} respondendo` : estado;
  }

  navigate(destino: string): void {
    this.router.navigate(['/home']);
  }

  
}
