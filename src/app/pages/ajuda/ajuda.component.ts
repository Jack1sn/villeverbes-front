// src/app/ajuda/ajuda.component.ts
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

  constructor(private ajudaService: AjudaService) {}

  ngOnInit(): void {
    this.carregarMensagens();
  }

  carregarMensagens(): void {
    this.carregando = true;
    this.ajudaService.listarMensagens().subscribe((resposta) => {
      this.mensagens = resposta;
      this.carregando = false;
    }, () => {
      this.erro = true;
      this.carregando = false;
    });
  }
}
