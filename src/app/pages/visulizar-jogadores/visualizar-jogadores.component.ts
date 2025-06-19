import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { JogadorService } from 'src/app/services/jogador.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-visualizar-jogadores',
  standalone: true,
  templateUrl: './visualizar-jogadores.component.html',
  styleUrls: ['./visualizar-jogadores.component.css'],
  imports: [CommonModule, HeaderComponent]
})
export class VisualizarJogadoresComponent implements OnInit {

  jogadores: Usuario[] = []; // Lista de jogadores
  loading: boolean = false; // Flag para carregamento
  errorMessage: string = ''; // Mensagem de erro

  constructor(private jogadorService: JogadorService) { }

  ngOnInit(): void {
    this.carregarJogadores(); // Carrega jogadores ao inicializar o componente
  }

  /**
   * Carrega a lista de jogadores do backend
   */
  async carregarJogadores(): Promise<void> {
    this.loading = true; // Inicia o carregamento
    this.errorMessage = ''; // Limpa a mensagem de erro

    try {
      // Chama o serviço para listar os jogadores
      this.jogadores = await this.jogadorService.listarJogadores();
    } catch (err) {
      // Se ocorrer erro, exibe uma mensagem
      console.error('Erro ao carregar jogadores:', err);
      this.errorMessage = 'Erro ao carregar jogadores.';
    } finally {
      this.loading = false; // Finaliza o carregamento
    }
  }

  /**
   * Alterna o status do jogador (ativo/inativo)
   */
  async alternarStatus(jogador: Usuario): Promise<void> {
    const novoStatus = !jogador.ativo; // Inverte o status do jogador

    try {
      // Chama o serviço para alterar o status do jogador
      await this.jogadorService.alterarStatusJogador(jogador.id!, novoStatus);
      jogador.ativo = novoStatus; // Atualiza o status localmente
    } catch (err) {
      // Se ocorrer erro, exibe uma mensagem de erro
      console.error('Erro ao atualizar status do jogador:', err);
      alert('Erro ao atualizar status do jogador');
    }
  }
}
