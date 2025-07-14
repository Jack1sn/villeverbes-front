import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RankingService, JogadorRanking } from '../../services/ranking.service'; // ajuste aqui
import { HeaderComponent } from '../header/header.component';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  ranking: JogadorRanking[] = [];
  erro: string | null = null;
  isAdmin: boolean = false;
  usuarioId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private rankingService: RankingService
  ) {}

  ngOnInit() {
    const perfil = this.authService.getRole();
    this.isAdmin = perfil === 'ADMIN';

    if (this.isAdmin) {
      this.carregarRankingGeral();
    } else {
      this.usuarioId = this.authService.getUserId();
      if (this.usuarioId) {
        this.carregarRankingJogador(this.usuarioId);
      } else {
        this.erro = 'ID do jogador não encontrado.';
      }
    }
  }

  carregarRankingJogador(id: string) {
    this.rankingService.getRankingPorUsuario(id).subscribe({
      next: (data) => (this.ranking = data),
      error: (err) => {
        console.error( 'Erreur lors de la recherche du classement du joueur :', err);
        this.erro = 'Erreur lors du chargement du classement du joueur.' ;
      }
    });
  }

  carregarRankingGeral() {
    this.rankingService.getRankingGeral().subscribe({
      next: (data) => (this.ranking = data),
      error: (err) => {
        console.error('Erreur lors de la recherche du classement général:', err);
        this.erro = 'Erreur lors du chargement du classement général.';
      }
    });
  }
}
