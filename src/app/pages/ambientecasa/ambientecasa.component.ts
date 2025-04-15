import { Component } from '@angular/core';
import { Router} from '@angular/router'
@Component({
  selector: 'app-ambientecasa',
  standalone: true,
  imports: [ ],
  templateUrl: './ambientecasa.component.html',
  styleUrl: './ambientecasa.component.css'
})
export class AmbientecasaComponent {
  constructor(private router: Router) {}

 
  navigate(destino: string): void {
    this.router.navigate(['/' + destino]);
  }
}

