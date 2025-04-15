import { Component } from '@angular/core';
import {Router} from '@angular/router'
@Component({
  selector: 'app-ambienteparque',
  standalone: true,
  imports: [],
  templateUrl: './ambienteparque.component.html',
  styleUrl: './ambienteparque.component.css'
})
export class AmbienteparqueComponent {

  constructor(private router: Router) {}
  navigate(destino: string): void {
    this.router.navigate(['/' + destino]);
  }

}
