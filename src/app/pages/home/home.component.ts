import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PersonagemService } from '../../services/personagem.service'; // Importe o serviço de personagem
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Variáveis para armazenar o personagem selecionado, a resposta do usuário e a frase a ser conjugada
  personagemSelecionado: string | null = null;
  respostaDigitada: string = '';
  fraseSelecionada: string = 'Conjuguez le verbe "être" au présent'; // Exemplo de frase para conjugar
  resultado: string | null = null;

  constructor(
    private router: Router,
    private personagemService: PersonagemService // Injete o serviço de personagem
  ) {}

  // Método de navegação para outras páginas
  navigate(destino: string): void {
    this.router.navigate(['/' + destino]);
  }

  // Método para selecionar o personagem
  selecionarPersonagem(personagem: string): void {
    this.personagemSelecionado = personagem;
    console.log('Personagem selecionado:', personagem);
    
    // Atualiza o nome do personagem no serviço para ser compartilhado com outros componentes
    this.personagemService.setPersonagem(personagem);
  }

  // Método para verificar a resposta do usuário (exemplo de conjugação)
  verificarResposta(): void {
    // Aqui, substitua pela lógica para verificar se a resposta está correta
    if (this.respostaDigitada.toLowerCase() === 'suis') {
      this.resultado = 'OK';
    } else {
      this.resultado = 'Mau! Essayez encore';
    }
  }
}
