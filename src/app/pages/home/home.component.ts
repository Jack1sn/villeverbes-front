import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PersonagemService } from '../../services/personagem.service';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { ProgressoService } from '../../services/progresso.service';

import { JogadorService } from '../../services/jogador.service'; //

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  personagemSelecionado: string | null = null;
  personagemImagem: string = 'assets/vvimagens/usuario2.png'; // imagem padrão
  
  respostaDigitada: string = '';
  fraseSelecionada: string = 'Conjuguez le verbe "être" au présent';
  resultado: string | null = null;

  progressoCasa: number = 0.00;
  progressoParque: number = 0;
  progressoUniversidade: number = 0;

  usuarioNome: string = 'Utilisateur';

  showModal: boolean = false;

  constructor(
    private router: Router,
    private personagemService: PersonagemService,
    private progressoService: ProgressoService,
   private jogadorService: JogadorService 
  ) {}

ngOnInit(): void {
  this.progressoCasa = this.progressoService.getProgresso('casa');
  this.progressoParque = this.progressoService.getProgresso('parque');
  this.progressoUniversidade = this.progressoService.getProgresso('universidade');

  const nomeUsuarioLogado = localStorage.getItem('usuarioLogado');
  const personagemSalvo = localStorage.getItem('usuarioNome'); // personagem
  const imagemSalva = localStorage.getItem('usuarioImagem');

  // Se tiver personagem salvo, usa como nomeUsuario. Senão, usa nome do login.
  if (personagemSalvo) {
    this.personagemSelecionado = personagemSalvo;
    this.usuarioNome = personagemSalvo;
  } else if (nomeUsuarioLogado) {
    this.usuarioNome = nomeUsuarioLogado;
  }

  if (imagemSalva) {
    this.personagemImagem = imagemSalva;
  }
}


  navigate(destino: string): void {
    this.router.navigate(['/' + destino]);
  }

  abrirModal(): void {
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
  }

  selecionarPersonagem(personagem: string): void {
    this.personagemSelecionado = personagem;
    this.usuarioNome = personagem;
    this.personagemImagem = `assets/vvimagens/${personagem.toLowerCase()}.jpg`;

    // Salvar nos serviços e localStorage
    this.personagemService.setPersonagem(personagem);
    localStorage.setItem('usuarioNome', personagem);
    localStorage.setItem('usuarioImagem', this.personagemImagem);

    this.fecharModal();

    console.log('Personagem selecionado:', personagem);
  }

  verificarResposta(): void {
    if (this.respostaDigitada.toLowerCase() === 'suis') {
      this.resultado = 'OK';
    } else {
      this.resultado = 'Uuuff! Essayez encore';
    }
  }
}
