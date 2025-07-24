import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faEdit, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { NgxPaginationModule } from 'ngx-pagination';

import { CrudAmbienteService } from '../../services/crudAmbiente.service';
import { HeaderComponent } from '../header/header.component';
import { Frase } from './../../models/frase';

interface Ambiente {
  id?: number;
  nome: string;
  tempo: string;
  texto: string;
  fundoImagem?: string;
  frases: Frase[];
}

@Component({
  standalone: true,
  selector: 'app-crud-ambiente',
  templateUrl: './crud-ambiente.component.html',
  styleUrls: ['./crud-ambiente.component.css'],
  imports: [
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    NgxPaginationModule,
    HeaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrudAmbienteComponent implements OnInit {
  faTrash = faTrash;
  faEdit = faEdit;
  faPlus = faPlus;
  faEye = faEye;

  ambientes: Ambiente[] = [];
  pronomes: { id: number; texto: string }[] = [];
  verbos: { id: number; verbo: string }[] = [];
  tempos: { id: number; tempo: string }[] = [];
  complementos: { id?: number; texto: string; descricao?: string  }[] = [];

  novaFrase: Frase = {
    pronomeId: 0,
    verboId: 0,
    complementoId: 0,
    complemento: '',
    tempoId: 0,
    resposta: '',
    pronome: '',
    verbo: '',
    tempo: ''
  };

  // Paginação
  page: number = 1;
  itemsPerPage: number = 11;
  totalItems: number = 0;

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  isFraseModalOpen = false;
  isEditingFrase = false;
  ambienteSelecionadoIndex = -1;
  fraseEditandoIndex = -1;

  isFraseModalCompleteOpen = false;
  fraseCompleta: Frase | null = null;

  numeros: number[] = Array.from({ length: 11 }, (_, i) => i + 1);

  constructor(private crudService: CrudAmbienteService) {}

  async ngOnInit(): Promise<void> {
    try {
      const [pronomes, verbos, tempos, complementos] = await Promise.all([
        this.crudService.getPronomes(),
        this.crudService.getVerbos(),
        this.crudService.getTemposVerbais(),
        this.crudService.getComplementos()
      ]);

      this.pronomes = pronomes;
      this.verbos = verbos;
      this.tempos = tempos;
      this.complementos = complementos;

      await this.carregarFrases();
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  }

  async carregarFrases(): Promise<void> {
    try {
      const frasesDto = await this.crudService.getFrases();
      const frasesConvertidas = frasesDto.map(f => this.convertDtoToFrase(f));
      this.totalItems = frasesConvertidas.length;

      this.ambientes = [{
        id: 1,
        nome: 'Maison',
        tempo: 'Présent',
        texto: '',
        frases: frasesConvertidas
      }];
    } catch (error) {
      console.error('Erro ao carregar frases:', error);
    }
  }

  convertDtoToFrase(dto: any): Frase {
  return {
    id: dto.id,
    pronomeId: dto.pronomeId,
    verboId: dto.verboInfinitivoId,
    complementoId: dto.complementoId,
    complemento: this.complementos.find(c => c.id === dto.complementoId)?.texto || '',
    complementoDescricao: this.complementos.find(c => c.id === dto.complementoId)?.descricao || '', // Ajuste aqui
    tempoId: dto.tempoVerbalId,
    resposta: dto.respostaCorreta,
    pronome: this.pronomes.find(p => p.id === dto.pronomeId)?.texto || '',
    verbo: this.verbos.find(v => v.id === dto.verboInfinitivoId)?.verbo || '',
    tempo: this.tempos.find(t => t.id === dto.tempoVerbalId)?.tempo || ''
  };
}


  convertFraseToDto(frase: Frase): any {
  const pronomeObj = this.pronomes.find(p => p.texto === frase.pronome || p.id === frase.pronomeId);
  const verboObj = this.verbos.find(v => v.verbo === frase.verbo || v.id === frase.verboId);
  const tempoObj = this.tempos.find(t => t.tempo === frase.tempo || t.id === frase.tempoId);

  if (!pronomeObj || !verboObj || !tempoObj) {
    throw new Error('Tous les champos (pronom, verbe et temps) doivent être remplir corretement.');
  }

  // Inicializa complementoId como 0 (valor default, porque será gerado pelo back-end)
  let complementoId: number | undefined = undefined;

  // Para criação (caso não haja complementoId)
  if (frase.complemento && frase.complemento.trim()) {
    // Para criação de nova frase, apenas mandamos o texto do complemento
    complementoId = undefined; // Não atribuímos complementoId, pois será gerado pelo back-end
  }

  // Para edição (caso já exista complementoId)
  if (this.isEditingFrase && frase.complementoId) {
    complementoId = frase.complementoId; // Usamos o complementoId vindo da edição
  }

  return {
    id: frase.id,
    pronomeId: pronomeObj.id,
    verboInfinitivoId: verboObj.id,
    tempoVerbalId: tempoObj.id,
    complementoId: complementoId, // Para criação será undefined, para edição será o complementoId
    respostaCorreta: frase.resposta.trim()
  };
}


 openModalAdicionarFrase(ambienteIndex: number): void {
  this.ambienteSelecionadoIndex = ambienteIndex;

  // Inicializa novaFrase com todos os campos necessários, incluindo 'complementoDescricao'
  this.novaFrase = {
    pronomeId: 0,
    verboId: 0,
    complementoId: 0,
    complemento: '',
    complementoDescricao: '',  // Agora inicializa o campo 'complementoDescricao'
    tempoId: 0,
    resposta: '',
    pronome: '',
    verbo: '',
    tempo: ''
  };

  this.isEditingFrase = false;
  this.isFraseModalOpen = true;
}


openModalEditarFrase(ambienteIndex: number, fraseIndex: number): void {
  this.ambienteSelecionadoIndex = ambienteIndex;
  this.fraseEditandoIndex = fraseIndex;
  const frase = this.ambientes[ambienteIndex].frases[fraseIndex];
  this.novaFrase = { ...frase };
  this.isEditingFrase = true;
  this.isFraseModalOpen = true;

  // Preenchendo complementoDescricao se existir
  if (frase.complementoId) {
    const complemento = this.complementos.find(c => c.id === frase.complementoId);
    if (complemento) {
      this.novaFrase.complementoDescricao = complemento.descricao || ''; // Agora 'descricao' existe
    }
  }
}


  closeModal(): void {
    this.isFraseModalOpen = false;
    this.isEditingFrase = false;
    this.fraseEditandoIndex = -1;
    this.ambienteSelecionadoIndex = -1;
    this.novaFrase = {
      pronomeId: 0,
      verboId: 0,
      complementoId: 0,
      complemento: '',
      tempoId: 0,
      resposta: '',
      pronome: '',
      verbo: '',
      tempo: ''
    };
  }

async saveFrase(): Promise<void> {
  if (this.ambienteSelecionadoIndex === -1) return;

  // Verificação do campo "Resposta" - obrigatório
  if (!this.novaFrase.resposta.trim()) {
    alert('O campo "Resposta" é obrigatório.');
    return;
  }

  // Verificação do campo "Complemento" - se preenchido, deve ser válido
  if (this.novaFrase.complemento && this.novaFrase.complemento.trim() === '') {
    alert('O campo "Complemento" não pode ser vazio.');
    return;
  }

  const ambiente = this.ambientes[this.ambienteSelecionadoIndex];

  try {
    const dto = this.convertFraseToDto(this.novaFrase);

    if (this.isEditingFrase && this.fraseEditandoIndex >= 0) {
      // Atualizando a frase existente
      await this.crudService.updateFrase(dto);
      const fraseAtualizada = this.convertDtoToFrase(dto);
      ambiente.frases[this.fraseEditandoIndex] = fraseAtualizada;
    } else {
      // Adicionando uma nova frase
      const novoDto = await this.crudService.addFrase(dto);
      const novaFraseUI = this.convertDtoToFrase(novoDto);
      ambiente.frases.push(novaFraseUI);
    }
    this.closeModal();
  } catch (error: any) {
    const errorMessage = error?.message || 'Erro desconhecido';
    console.error('Erro ao salvar a frase:', errorMessage);
    alert('Erro: ' + errorMessage);
  }
}



  async deleteFrase(ambienteIndex: number, frases: Frase): Promise<void> {
    if (!frases.id) return;

    try {
      await this.crudService.deleteFrase(frases.id);

      const ambiente = this.ambientes[ambienteIndex];
      const indexReal = ambiente.frases.findIndex(f => f.id === frases.id);

      if (indexReal !== -1) {
        ambiente.frases.splice(indexReal, 1);
        this.totalItems--;
      }
    } catch (error) {
      console.error('Erreur lors de supprimer la phrase:', error);
    }
  }

  trackById(index: number, item: any): number {
    return item.id!;
  }


  // Nomes dos ambientes por faixa de página
ambientesNomes: string[] = ['Maison', 'Parc', 'Université'];

getAmbienteAtual(): string {
  const index = Math.floor((this.page - 1) / 2);
  return this.ambientesNomes[index] || 'Autre';
}

}
