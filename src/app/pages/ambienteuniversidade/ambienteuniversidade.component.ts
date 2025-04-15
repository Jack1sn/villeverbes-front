import { Component } from '@angular/core';
import {Router} from '@angular/router'
@Component({
  selector: 'app-ambienteuniversidade',
  standalone: true,
  imports: [],
  templateUrl: './ambienteuniversidade.component.html',
  styleUrl: './ambienteuniversidade.component.css'
})
export class AmbienteuniversidadeComponent {

  constructor(private router: Router) {}
  navigate(destino: string): void {
    this.router.navigate(['/' + destino]);
  }
}
