import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { HeaderComponent } from "../header/header.component";

interface Jogador {
  nome: string;
  posicao: string;
  seloAmbiente: string;
}

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  jogador: Jogador | null = null;
  idJogador: string | null = null;
  erro: string | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.idJogador = this.route.snapshot.paramMap.get('id');
    if (this.idJogador) {
      this.getRanking(this.idJogador).subscribe({
        next: (data) => {
          this.jogador = data;
        },
        error: (err) => {
          console.error('Erro ao buscar ranking:', err);
          this.erro = 'Não foi possível carregar os dados do ranking.';
        }
      });
    } else {
      this.erro = 'ID do jogador não informado.';
    }
  }

  getRanking(id: string): Observable<Jogador> {
    return this.http.get<Jogador>(`/api/usuarios/jogador/${id}/ranking`);
  }
}
