import { Component, OnInit } from '@angular/core';
import { CrudAmbienteService } from '../../services/crudAmbiente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '../header/header.component';
import { Frase } from './../../models/frase';
import { firstValueFrom } from 'rxjs';

interface Ambiente {
  id?: number;
  nome: string;
  tempo: string;
  texto:string;
  fundoImagem?: string;
  frases: Frase[];
}

@Component({
  standalone: true,
  selector: 'app-crud-ambiente',
  templateUrl: './crud-ambiente.component.html',
  styleUrls: ['./crud-ambiente.component.css'],
  imports: [FormsModule, CommonModule, FontAwesomeModule, HeaderComponent]
})
export class CrudAmbienteComponent implements OnInit {
  faTrash = faTrash;
  faEdit = faEdit;
  faPlus = faPlus;

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

  isFraseModalOpen = false;
  isEditingFrase = false;
  ambienteSelecionadoIndex = -1;
  fraseEditandoIndex = -1;

  constructor(private crudService: CrudAmbienteService) {}

  async ngOnInit(): Promise<void> {
    try {
      const [pronomes, verbos, tempos] = await Promise.all([
        firstValueFrom(this.crudService.getPronomes()),
        firstValueFrom(this.crudService.getVerbos()),
        firstValueFrom(this.crudService.getTemposVerbais())
      ]);

      this.pronomes = pronomes;
      this.verbos = verbos;
      this.tempos = tempos;

      this.carregarFrases();
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  }

  carregarFrases(): void {
    this.crudService.getFrases().subscribe(frasesDto => {
      const frasesConvertidas = frasesDto.map(f => this.convertDtoToFrase(f));

      this.ambientes = [{
        id: 1,
        nome: 'Casa',
        tempo: 'Présent',
        texto:'',
        frases: frasesConvertidas
      }];
    });
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
    if (!frase.pronome || !frase.verbo || !frase.tempo|| !frase.complemento?.trim()) {
      throw new Error('Todos os campos devem ser preenchidos corretamente.');
    }

    return {
      id: frase.id,
    pronomeTexto: frase.pronome.trim(),
    verboTexto: frase.verbo.trim(),
    tempoVerbalTexto: frase.tempo.trim(),
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

  saveFrase(): void {
    if (this.ambienteSelecionadoIndex === -1) return;
    const ambiente = this.ambientes[this.ambienteSelecionadoIndex];

    try {
      const dto = this.convertFraseToDto(this.novaFrase);

      if (this.isEditingFrase && this.fraseEditandoIndex >= 0) {
        this.crudService.updateFrase(dto).subscribe(() => {
          ambiente.frases[this.fraseEditandoIndex] = { ...this.novaFrase };
          this.closeModal();
        });
      } else {
        this.crudService.addFrase(dto).subscribe(novoDto => {
          const novaFraseUI = this.convertDtoToFrase(novoDto);
          ambiente.frases.push(novaFraseUI);
          this.closeModal();
        });
      }
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

  deleteFrase(ambienteIndex: number, fraseIndex: number): void {
    const frase = this.ambientes[ambienteIndex].frases[fraseIndex];
    if (!frase.id) return;

    this.crudService.deleteFrase(frase.id).subscribe(() => {
      this.ambientes[ambienteIndex].frases.splice(fraseIndex, 1);
    });
  }

  trackById(index: number, item: any): number {
    return item.id;
  }
}
