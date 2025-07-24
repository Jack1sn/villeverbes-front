import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necessário para ngModel
import { HeaderComponent } from '../header/header.component';
import { AjudaService, MensagemAjuda } from '../../services/ajuda.service';

@Component({
  selector: 'app-ajuda',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './ajuda.component.html',
  styleUrls: ['./ajuda.component.css']
})
export class AjudaComponent implements OnInit {
  mensagens: MensagemAjuda[] = [];
  mensagensExibidas: MensagemAjuda[] = [];
  erro = false;
  carregando = true;
  sucesso = false;
  quantidadeMensagensNaoRespondidas: number = 0;
  respostaTexto: string = '';
  mensagemSelecionada?: MensagemAjuda;

  paginaAtual: number = 1;
  totalPaginas: number = 1;
  mensagensPorPagina: number = 1;

  constructor(private ajudaService: AjudaService) {}

  ngOnInit(): void {
    this.carregarMensagens();
    this.contarNaoRespondidas();
  }

carregarMensagens(): void {
  this.carregando = true;
  this.erro = false;
  this.sucesso = false;

  this.ajudaService.listarMensagens().subscribe({
    next: (resposta: MensagemAjuda[]) => {
      // Ordena da mais nova para mais antiga
      this.mensagens = resposta.sort((a, b) =>
        (b.dataEnvio?.getTime() || 0) - (a.dataEnvio?.getTime() || 0)
      );

      this.totalPaginas = Math.ceil(this.mensagens.length / this.mensagensPorPagina);

      // Começar na ÚLTIMA página para mostrar a mensagem mais recente
      this.paginaAtual = 1;

      this.atualizarMensagensExibidas();

      this.carregando = false;
      this.sucesso = true;
      setTimeout(() => this.sucesso = false, 3000);
    },
    error: () => {
      this.erro = true;
      this.carregando = false;
    }
  });
}



  removerMensagemDaTela(mensagem: MensagemAjuda): void {
    this.mensagensExibidas = this.mensagensExibidas.filter(msg => msg.id !== mensagem.id);
  }

  contarNaoRespondidas(): void {
    this.ajudaService.contarNaoRespondidas().subscribe({
      next: (quantidade: number) => {
        this.quantidadeMensagensNaoRespondidas = quantidade;
      },
      error: () => {
        console.error('Erro ao contar mensagens não respondidas.');
        this.quantidadeMensagensNaoRespondidas = 0;
      }
    });
  }

  iniciarResposta(mensagem: MensagemAjuda): void {
    this.mensagemSelecionada = mensagem;
    this.respostaTexto = '';
  }

  cancelarResposta(): void {
    this.mensagemSelecionada = undefined;
    this.respostaTexto = '';
  }

 enviarResposta(): void {
  if (!this.mensagemSelecionada || !this.respostaTexto.trim()) return;

  this.ajudaService.responderEmail(
    this.mensagemSelecionada.id!,
    this.respostaTexto,
    this.mensagemSelecionada.remetente
  ).subscribe({
    next: () => {
      this.carregarMensagens();
      this.cancelarResposta();
    },
    error: () => {
      alert('Erro ao enviar resposta');
    }
  });
}


    atualizarMensagensExibidas(): void {
  const inicio = (this.paginaAtual - 1) * this.mensagensPorPagina;
  const fim = inicio + this.mensagensPorPagina;
  this.mensagensExibidas = this.mensagens.slice(inicio, fim);
}
mudarPagina(direcao: 'anterieur' | 'prochin'): void {
  if (direcao === 'anterieur' && this.paginaAtual > 1) {
    this.paginaAtual--;
  } else if (direcao === 'prochin' && this.paginaAtual < this.totalPaginas) {
    this.paginaAtual++;
  }

  this.atualizarMensagensExibidas();
}

}
