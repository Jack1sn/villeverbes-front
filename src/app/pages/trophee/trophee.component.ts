import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-trophee',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './trophee.component.html',
})
export class TropheeComponent implements OnInit {
  userId: string | null = null;
  trofeus: any[] = [];
  totalAmbientes = 3;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');

    if (this.userId) {
      this.carregarTrofeusPorUsuario(this.userId);
    } else {
      this.carregarTodosTrofeus();
    }
  }

  carregarTrofeusPorUsuario(id: string) {
    // Simulação de dados por jogador
    this.trofeus = [
      { selo: 'Casa', trofeu: 0 },
      { selo: 'Parque', trofeu: 0 },
      { selo: 'Universidade', trofeu: 0 },
    ];
  }

  carregarTodosTrofeus() {
    // Simulação de dados para admins
    this.trofeus = [
      { usuario: 'Ana', selo: 'Casa'},
      { usuario: 'Ana', selo: 'Parque', trofeu: 1  },
      { usuario: 'Ana', selo: 'Universidade' },
    
    ];
  }
}
