import { Component } from '@angular/core';
import {Router, RouterModule} from '@angular/router'
import { HeaderComponent } from "../header/header.component";
@Component({
  selector: 'app-ambienteparque',
  standalone: true,
  imports: [HeaderComponent, RouterModule],
  templateUrl: './ambienteparque.component.html',
  styleUrl: './ambienteparque.component.css'
})
export class AmbienteparqueComponent {

  constructor(private router: Router) {}
  navigate(destino: string): void {
    this.router.navigate(['/' + destino]);
  }

}
