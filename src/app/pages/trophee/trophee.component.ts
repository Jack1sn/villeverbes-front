import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { TropheeService, SeloMedalhaDTO } from '../../services/trophee.service';

interface TrofeuItem {
  selo: 'Maison' | 'Place' | 'Université';
  value: number;
}

@Component({
  selector: 'app-trophee',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './trophee.component.html',
})
export class TropheeComponent implements OnInit {
  userId: string | null = null;
  trofeus: TrofeuItem[] = [];
  medalhaValor: number = 0;
  mostrarMedalha: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private tropheeService: TropheeService
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    const idNum = this.userId ? Number(this.userId) : NaN;

    if (!isNaN(idNum)) {
      this.carregarTrofeusPorUsuario(idNum);
    } else {
      this.carregarTodosTrofeus();
    }
  }

  carregarTrofeusPorUsuario(id: number) {
    this.tropheeService.getTrofeusPorUsuario(id).subscribe({
      next: (res: SeloMedalhaDTO[]) => {
        this.trofeus = [];
        res.forEach(selo => {
          this.trofeus.push({ selo: 'Maison', value: selo.seloCasa });
          this.trofeus.push({ selo: 'Place', value: selo.seloParque });
          this.trofeus.push({ selo: 'Université', value: selo.seloUniversidade });
          this.medalhaValor = selo.medalha;
          this.mostrarMedalha = this.medalhaValor >= 0;
        });
      },
      error: err => console.error('Erreur lors du chargement des trophées :', err)
    });
  }

  carregarTodosTrofeus() {
    // Aqui se quiser carregar tudo, você pode implementar
  }

  incrementar(item: TrofeuItem) {
    item.value++;
    // Aqui pode chamar API para salvar ou atualizar backend se quiser
  }
}
