import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule], // necessário para usar routerLink no HTML
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'] // <- Corrigido aqui (era styleUrl)
})
export class HeaderComponent {}
