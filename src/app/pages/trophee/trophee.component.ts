import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { TropheeService, SeloMedalhaDTO } from '../../services/trophee.service';

@Component({
  selector: 'app-trophee',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './trophee.component.html',
})
export class TropheeComponent implements OnInit {
  userId: string | null = null; // Corrigido para string, pois paramMap.get() retorna string | null
  trofeus: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private tropheeService: TropheeService
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId !== null) {
      const idNumerico = Number(this.userId);
      if (!isNaN(idNumerico)) {
        this.carregarTrofeusPorUsuario(idNumerico);
      } else {
        console.warn('ID inválido na URL:', this.userId);
      }
    } else {
      this.carregarTodosTrofeus();
    }
  }

  carregarTrofeusPorUsuario(id: number) {
    this.tropheeService.getTrofeusPorUsuario(id).subscribe({
      next: (res: SeloMedalhaDTO[]) => {
        this.trofeus = [];

        res.forEach((selo) => {
          this.trofeus.push({ selo: 'Casa', numero: selo.seloCasa });
          this.trofeus.push({ selo: 'Parque', numero: selo.seloParque });
          this.trofeus.push({ selo: 'Universidade', numero: selo.seloUniversidade });
          this.trofeus.push({ selo: 'Medalha', numero: selo.medalha });
        });
      },
      error: (err) => {
        console.error('Erro ao carregar troféus do usuário:', err);
      }
    });
  }

  carregarTodosTrofeus() {
    // Pode ser adaptado futuramente para buscar de uma API real
    this.trofeus = [
      { usuario: 'Ana', selo: 'Casa', trofeu: 'Bronze' },
      { usuario: 'Ana', selo: 'Parque', trofeu: 'Prata' },
      { usuario: 'Ana', selo: 'Universidade', trofeu: 'Ouro' }
    ];
  }
}
