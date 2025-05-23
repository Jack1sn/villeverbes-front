import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PersonagemService } from '../../services/personagem.service'; // Importe o serviço de personagem
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { ProgressoService } from '../../services/progresso.service';

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
  progressoCasa: number = 0;
  progressoParque: number = 0;
  progressoUniversidade: number = 0;
  usuarioNome: string = 'Utilisateur'; // Valor padrão



  constructor(
    private router: Router,
    private personagemService: PersonagemService, // Injete o serviço de personagem
    private progressoService: ProgressoService,
  ) {}

  ngOnInit(): void {
    // Atualiza os valores de progresso ao carregar
    this.progressoCasa = this.progressoService.getProgresso('casa');
    this.progressoParque = this.progressoService.getProgresso('parque');
    this.progressoUniversidade = this.progressoService.getProgresso('universidade');

    const nomeSalvo = localStorage.getItem('usuarioNome');
    if (nomeSalvo) {
      this.usuarioNome = nomeSalvo;
    }
  }
  

  // Método de navegação para outras páginas
  navigate(destino: string): void {
    this.router.navigate(['/' + destino]);
  }

  fecharModal(): void {
    this.showModal = false;
  }
  
  // Método para selecionar o personagem
  selecionarPersonagem(personagem: string): void {
    this.personagemSelecionado = personagem;
    this.personagemService.setPersonagem(personagem);
  this.fecharModal();
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
      this.resultado = 'Uuuff! Essayez encore';
    }
  }

  showModal: boolean = false;

abrirModal(): void {
  this.showModal = true;
}

//---------------



}
