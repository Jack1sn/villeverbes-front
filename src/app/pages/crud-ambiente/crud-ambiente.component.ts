import { Component, OnInit } from '@angular/core';
import { CrudAmbienteService } from '../../services/crudAmbiente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faEdit, faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '../header/header.component';
import { Frase } from './../../models/frase';
import { NgxPaginationModule } from 'ngx-pagination';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
  imports: [FormsModule, CommonModule, FontAwesomeModule, 
    HeaderComponent, NgxPaginationModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class CrudAmbienteComponent implements OnInit {
  faTrash = faTrash;
  faEdit = faEdit;
  faPlus = faPlus;
  faEye = faEye;  // Ícone para visualizar a frase completa

  ambientes: Ambiente[] = [];
  pronomes: { id: number; texto: string }[] = [];
  verbos: { id: number; verbo: string }[] = [];
  tempos: { id: number; tempo: string }[] = [];

  novaFrase: Frase = {
    pronomeId: 0,
    verboId: 0,
    complemento: '',
    tempoId: 0,
    resposta: ''
  };

  // Variáveis para controle de paginação
  page: number = 1;
  itemsPerPage: number = 11;
  totalItems: number = 22;
  
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  isFraseModalOpen = false;
  isEditingFrase = false;
  ambienteSelecionadoIndex = -1;
  fraseEditandoIndex = -1;

  // Variáveis para controlar o modal de frase completa
  isFraseModalCompleteOpen = false;
  fraseCompleta: Frase | null = null;

  constructor(private crudService: CrudAmbienteService) {}

  async ngOnInit(): Promise<void> {
    try {
      const [pronomes, verbos, tempos] = await Promise.all([
        this.crudService.getPronomes(),
        this.crudService.getVerbos(),
        this.crudService.getTemposVerbais()
      ]);

      this.pronomes = pronomes;
      this.verbos = verbos;
      this.tempos = tempos;

      await this.carregarFrases();
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  }

  async carregarFrases(): Promise<void> {
    try {
      const frasesDto = await this.crudService.getFrases();
      const frasesConvertidas = frasesDto.map(f => this.convertDtoToFrase(f));

      // Atualize o total de itens
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
      complemento: dto.complementoDescricao,
      tempoId: dto.tempoVerbalId,
      resposta: dto.respostaCorreta
    };
  }

  convertFraseToDto(frase: Frase): any {
    if (!frase.pronomeId || !frase.verboId || !frase.tempoId || !frase.complemento?.trim()) {
      throw new Error('Todos os campos devem ser preenchidos corretamente.');
    }

    return {
      id: frase.id,
      pronomeTexto: frase.pronomeId,
      verboTexto: frase.verboId,
      tempoVerbalTexto: frase.tempoId,
      complementoDescricao: frase.complemento.trim(),
      respostaCorreta: frase.resposta.trim()
    };
  }

  openModalAdicionarFrase(ambienteIndex: number): void {
    this.ambienteSelecionadoIndex = ambienteIndex;
    this.novaFrase = {
      pronomeId: 0,
      verboId: 0,
      complemento: '',
      tempoId: 0,
      resposta: ''
    };
    this.isEditingFrase = false;
    this.isFraseModalOpen = true;
  }

  openModalEditarFrase(ambienteIndex: number, fraseIndex: number): void {
    this.ambienteSelecionadoIndex = ambienteIndex;
    this.fraseEditandoIndex = fraseIndex;
    this.novaFrase = { ...this.ambientes[ambienteIndex].frases[fraseIndex] };
    this.isEditingFrase = true;
    this.isFraseModalOpen = true;
  }

  openModalMostrarFrase(frase: Frase): void {
    this.fraseCompleta = frase;
    this.isFraseModalCompleteOpen = true;
  }

  closeModalComplete(): void {
    this.isFraseModalCompleteOpen = false;
    this.fraseCompleta = null;
  }

  async saveFrase(): Promise<void> {
    if (this.ambienteSelecionadoIndex === -1) return;
    const ambiente = this.ambientes[this.ambienteSelecionadoIndex];

    try {
      const dto = this.convertFraseToDto(this.novaFrase);

      if (this.isEditingFrase && this.fraseEditandoIndex >= 0) {
        await this.crudService.updateFrase(dto);
        ambiente.frases[this.fraseEditandoIndex] = { ...this.novaFrase };
      } else {
        const novoDto = await this.crudService.addFrase(dto);
        const novaFraseUI = this.convertDtoToFrase(novoDto);
        ambiente.frases.push(novaFraseUI);
      }
      this.closeModal();
    } catch (error: any) {
      alert('Erro: ' + (error?.message || 'Desconhecido'));
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
      complemento: '',
      tempoId: 0,
      resposta: ''
    };
  }

  async deleteFrase(ambienteIndex: number, fraseIndex: number): Promise<void> {
    const frase = this.ambientes[ambienteIndex].frases[fraseIndex];
    if (!frase.id) return;

    try {
      await this.crudService.deleteFrase(frase.id);
      this.ambientes[ambienteIndex].frases.splice(fraseIndex, 1);
    } catch (error) {
      console.error('Erro ao deletar frase:', error);
    }
  }

  trackById(index: number, item: any): number {
    return item.id!;
  }

  numeros: number[] = Array.from({ length: 11 }, (_, i) => i + 1);


}
