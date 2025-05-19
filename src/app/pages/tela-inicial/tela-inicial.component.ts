// tela-inicial.component.ts
import { Component } from '@angular/core';
import { Router} from   '@angular/router';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-tela-inicial',
  standalone:true,
  templateUrl: './tela-inicial.component.html',
  styleUrls: ['./tela-inicial.component.css'],
  imports: [HeaderComponent]
})
export class TelaInicialComponent {
  constructor(private router: Router) {}

  // Método para redirecionar para a página Home
  

  // Método para tratar o login
  login(): void {
    this.router.navigate(['/login']);  // Redireciona para a página de login
  }

  // Método para exibir a ajuda
  showHelp(): void {
    alert('Aqui está a ajuda!');  // Aqui você pode mostrar mais interações, como um modal
  }

  // Método para iniciar o jogo
  startGame(): void {
    this.router.navigate(['/game']);  // Redireciona para a página do jogo
  }

  goToGEPTA(): void {
    window.open('https://gepta.weebly.com/', '_blank'); // Abre em nova aba
  }
}
  

