import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { JogadorService } from 'src/app/services/jogador.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-visualizar-jogadores',
  standalone:true,
  templateUrl: './visualizar-jogadores.component.html',
  styleUrls: ['./visualizar-jogadores.component.css'],
  imports: [CommonModule, HeaderComponent]
})
export class VisualizarJogadoresComponent implements OnInit {

  jogadores: Usuario[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private jogadorService: JogadorService) { }

  ngOnInit(): void {
    this.carregarJogadores();
  }

  /**
   * Busca todos os jogadores do backend
   */
  async carregarJogadores(): Promise<void> {
    this.loading = true;
    this.errorMessage = '';

    try {
      this.jogadores = await this.jogadorService.listarJogadores();
    } catch (err) {
      console.error('Erro ao carregar jogadores:', err);
      this.errorMessage = 'Erro ao carregar jogadores.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Alterna o status do jogador (ativo/inativo)
   */
  async alternarStatus(jogador: Usuario): Promise<void> {
    const novoStatus = !jogador.ativo;

    try {
      await this.jogadorService.alterarStatusJogador(jogador.id!, novoStatus);
      jogador.ativo = novoStatus;
    } catch (err) {
      console.error('Erro ao atualizar status do jogador:', err);
      alert('Erro ao atualizar status do jogador');
    }
  }
}
