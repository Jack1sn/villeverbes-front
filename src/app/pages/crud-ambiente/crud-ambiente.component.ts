import { Component, OnInit } from '@angular/core';
import { CrudAmbienteService } from '../../services/crudAmbiente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-crud-ambiente',
  templateUrl: './crud-ambiente.component.html',
  styleUrls: ['./crud-ambiente.component.css'],
  imports: [FormsModule, CommonModule]
})
export class CrudAmbienteComponent implements OnInit {

  ambientes: any[] = [];
  temposVerbais: string[] = [];
  pronomes: string[] = [];

  novoAmbiente: any = { nome: '', tempoVerbal: '', fundoImagem: '', frases: [] };
  novaFrase: any = { pronome: '', verbo: '', resposta: '' };

  isAmbienteModalOpen: boolean = false;
  isFraseModalOpen: boolean = false;
  ambienteSelecionadoIndex: number = -1;

  constructor(private crudService: CrudAmbienteService) {}

  ngOnInit(): void {
    this.carregarAmbientes();
    this.carregarTemposVerbais();
    this.carregarPronomes();
  }

  carregarAmbientes(): void {
    this.crudService.getAmbientes().subscribe((data) => {
      this.ambientes = data;
    });
  }

  carregarTemposVerbais(): void {
    this.crudService.getTemposVerbais().subscribe((data) => {
      this.temposVerbais = data;
    });
  }

  carregarPronomes(): void {
    this.crudService.getPronomes().subscribe((data) => {
      this.pronomes = data;
    });
  }

  openAmbienteModal(): void {
    this.novoAmbiente = { nome: '', tempoVerbal: '', fundoImagem: '', frases: [] };
    this.isAmbienteModalOpen = true;
  }

  openFraseModal(index: number): void {
    this.novaFrase = { pronome: '', verbo: '', resposta: '' };
    this.ambienteSelecionadoIndex = index;
    this.isFraseModalOpen = true;
  }

  closeModal(): void {
    this.isAmbienteModalOpen = false;
    this.isFraseModalOpen = false;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.novoAmbiente.fundoImagem = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  addAmbiente(): void {
    this.crudService.addAmbiente(this.novoAmbiente).subscribe(() => {
      this.carregarAmbientes();
      this.closeModal();
    });
  }

  addFrase(): void {
    const index = this.ambienteSelecionadoIndex;
    if (index >= 0 && index < this.ambientes.length) {
      this.ambientes[index].frases.push({ ...this.novaFrase });
      this.crudService.updateAmbiente(this.ambientes[index]).subscribe(() => {
        this.closeModal();
      });
    }
  }

  deleteAmbiente(index: number): void {
    const ambiente = this.ambientes[index];
    if (ambiente && ambiente.id) {
      this.crudService.deleteAmbiente(ambiente.id).subscribe(() => {
        this.carregarAmbientes();
      });
    }
  }
}
