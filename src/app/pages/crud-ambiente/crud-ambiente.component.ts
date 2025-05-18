import { Component, OnInit } from '@angular/core';
import { CrudAmbienteService } from '../../services/crudAmbiente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '../header/header.component';

interface Frase {
  pronome: string;
  verbo: string;
  complemento: string;
  resposta: string;
}

interface Ambiente {
  id?: number;
  nome: string;
  tempoVerbal: string;
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
  // Ícones FontAwesome
  faTrash = faTrash;
  faEdit = faEdit;
  faPlus = faPlus;

  // Dados carregados
  ambientes: Ambiente[] = [];
  temposVerbais: string[] = [];
  pronomes: string[] = [];

  // Modelos de criação/edição
  novoAmbiente: Ambiente = { nome: '', tempoVerbal: '', fundoImagem: '', frases: [] };
  novaFrase: Frase = { pronome: '', verbo: '', complemento: '', resposta: '' };

  // Controle de modais
  isAmbienteModalOpen = false;
  isFraseModalOpen = false;

  // Controle de edição de frase
  ambienteSelecionadoIndex = -1;
  fraseEditandoIndex = -1;
  isEditingFrase = false;

  constructor(private crudService: CrudAmbienteService) {}

  ngOnInit(): void {
    this.carregarAmbientes();
    this.carregarTemposVerbais();
    this.carregarPronomes();
  }

  // ====== Carregamento de Dados ======

  carregarAmbientes(): void {
    this.crudService.getAmbientes().subscribe(data => {
      this.ambientes = data;
    });
  }

  carregarTemposVerbais(): void {
    this.crudService.getTemposVerbais().subscribe(data => {
      this.temposVerbais = data;
    });
  }

  carregarPronomes(): void {
    this.crudService.getPronomes().subscribe(data => {
      this.pronomes = data;
    });
  }

  // ====== Modal Ambiente ======

  openAmbienteModal(): void {
    this.novoAmbiente = { nome: '', tempoVerbal: '', fundoImagem: '', frases: [] };
    this.isAmbienteModalOpen = true;
  }

  addAmbiente(): void {
    if (!this.novoAmbiente.nome || !this.novoAmbiente.tempoVerbal) return;
    this.crudService.addAmbiente(this.novoAmbiente).subscribe(() => {
      this.carregarAmbientes();
      this.closeModal();
    });
  }

  deleteAmbiente(index: number): void {
    const ambiente = this.ambientes[index];
    if (ambiente?.id) {
      this.crudService.deleteAmbiente(ambiente.id).subscribe(() => {
        this.carregarAmbientes();
      });
    }
  }

  // ====== Modal Frase (Adicionar ou Editar) ======

  openFraseModal(index: number): void {
    this.novaFrase = { pronome: '', verbo: '', complemento: '', resposta: '' };
    this.ambienteSelecionadoIndex = index;
    this.fraseEditandoIndex = -1;
    this.isEditingFrase = false;
    this.isFraseModalOpen = true;
  }

  editFrase(ambienteIndex: number, fraseIndex: number): void {
    const frase = this.ambientes[ambienteIndex].frases[fraseIndex];
    this.novaFrase = { ...frase };
    this.ambienteSelecionadoIndex = ambienteIndex;
    this.fraseEditandoIndex = fraseIndex;
    this.isEditingFrase = true;
    this.isFraseModalOpen = true;
  }

  saveFrase(): void {
    const ambiente = this.ambientes[this.ambienteSelecionadoIndex];
    if (!ambiente) return;

    if (this.isEditingFrase && this.fraseEditandoIndex >= 0) {
      // Editar frase existente
      ambiente.frases[this.fraseEditandoIndex] = { ...this.novaFrase };
    } else {
      // Adicionar nova frase
      ambiente.frases.push({ ...this.novaFrase });
    }

    this.crudService.updateAmbiente(ambiente).subscribe(() => {
      this.closeModal();
    });
  }

  deleteFrase(ambienteIndex: number, fraseIndex: number): void {
    const ambiente = this.ambientes[ambienteIndex];
    if (!ambiente || !ambiente.frases[fraseIndex]) return;

    ambiente.frases.splice(fraseIndex, 1);
    this.crudService.updateAmbiente(ambiente).subscribe(() => {
      this.carregarAmbientes();
    });
  }

  // ====== Utilitários ======

  closeModal(): void {
    this.isAmbienteModalOpen = false;
    this.isFraseModalOpen = false;
    this.novaFrase = { pronome: '', verbo: '', complemento: '', resposta: '' };
    this.isEditingFrase = false;
    this.fraseEditandoIndex = -1;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.novoAmbiente.fundoImagem = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
