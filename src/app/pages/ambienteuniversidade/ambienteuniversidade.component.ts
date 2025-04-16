import { Component } from '@angular/core';
import {Router, RouterModule} from '@angular/router'
import { HeaderComponent } from "../header/header.component";
@Component({
  selector: 'app-ambienteuniversidade',
  standalone: true,
  imports: [HeaderComponent, RouterModule],
  templateUrl: './ambienteuniversidade.component.html',
  styleUrl: './ambienteuniversidade.component.css'
})
export class AmbienteuniversidadeComponent {

  constructor(private router: Router) {}
  navigate(destino: string): void {
    this.router.navigate(['/' + destino]);
  }
}
