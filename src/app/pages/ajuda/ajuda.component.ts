import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { AjudaService, MensagemAjuda } from '../../services/ajuda.service';

@Component({
  selector: 'app-ajuda',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './ajuda.component.html',
  styleUrls: ['./ajuda.component.css']
})
export class AjudaComponent implements OnInit {
  mensagens: MensagemAjuda[] = [];
  erro = false;
  carregando = true;
  sucesso = false;
  quantidadeMensagensNaoRespondidas: number = 0;

  constructor(private ajudaService: AjudaService) {}

  ngOnInit(): void {
    this.carregarMensagens();
  }

  carregarMensagens(): void {
    this.carregando = true;
    this.erro = false;
    this.sucesso = false;

    this.ajudaService.listarMensagens().subscribe({
      next: (resposta) => {
        this.mensagens = resposta;
        this.carregando = false;
        this.sucesso = true;

        // Oculta o sucesso após alguns segundos (opcional)
        setTimeout(() => this.sucesso = false, 3000);
      },
      error: () => {
        this.erro = true;
        this.carregando = false;
      }
    });
  }
}
