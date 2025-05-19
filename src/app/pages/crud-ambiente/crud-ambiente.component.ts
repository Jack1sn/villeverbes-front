import { Component, OnInit } from '@angular/core';
import { CrudAmbienteService } from '../../services/crudAmbiente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { HeaderComponent } from '../header/header.component';

// Definindo as interfaces para estrutura de dados
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
  // Ícones do FontAwesome
  faTrash = faTrash;
  faEdit = faEdit;
  faPlus = faPlus;

  // Dados do componente
  ambientes: Ambiente[] = [];
  pronomes: string[] = [];
  temposVerbais: string[] = ['Présent', 'Futur', 'Imparfait', 'Passé Composé', 'Conditionnel'];

  novoAmbiente: Ambiente = { nome: '', tempoVerbal: '', frases: [] };
  novaFrase: Frase = { pronome: '', verbo: '', complemento: '', resposta: '' };

  isAmbienteModalOpen = false;
  isFraseModalOpen = false;

  ambienteSelecionadoIndex = -1;
  fraseEditandoIndex = -1;
  isEditingFrase = false;

  // Frases fixas por ambiente
  frasesFixasPorAmbiente: { [key: string]: Frase[] } = {
    'Casa': [{ pronome: 'Je', verbo: 'suis', complemento: 'à la maison', resposta: 'suis' }],
    'Parque': [{ pronome: 'Nous', verbo: 'marchons', complemento: 'dans le parc', resposta: 'marchons' }],
    'Université': [{ pronome: 'Ils', verbo: 'étudient', complemento: 'à l\'université', resposta: 'étudient' }]
  };

  constructor(private crudService: CrudAmbienteService) {}

  ngOnInit(): void {
    // Carregar os ambientes da API e adicionar as frases fixas
    this.carregarAmbientes();
    this.carregarPronomes();
  }

  // Carregar os dados dos ambientes da API
  carregarAmbientes(): void {
    this.crudService.getAmbientes().subscribe(data => {
      // Adicionar frases fixas ou criar uma frase padrão caso não haja frases
      this.ambientes = data.map(ambiente => {
        let frases = this.frasesFixasPorAmbiente[ambiente.nome];

        // Se não houver frases fixas, adiciona uma frase padrão
        if (!frases || frases.length === 0) {
          frases = [{ pronome: 'Il', verbo: 'est', complemento: 'là', resposta: 'est' }];
        }

        return {
          ...ambiente,
          frases: [...frases]  // Atribuindo as frases ao ambiente
        };
      });

      // Log para depuração
      console.log('Ambientes carregados:', this.ambientes);
    });
  }

  // Carregar os pronomes
  carregarPronomes(): void {
    this.crudService.getPronomes().subscribe(data => {
      this.pronomes = data;
    });
  }

  // Modal para criar um novo ambiente
  openAmbienteModal(): void {
    this.novoAmbiente = { nome: '', tempoVerbal: '', frases: [] };
    this.isAmbienteModalOpen = true;
  }

  // Adicionar novo ambiente
  addAmbiente(): void {
    if (!this.novoAmbiente.nome || !this.novoAmbiente.tempoVerbal) return;
  
    // Garantir que as frases fixas estão associadas corretamente
    if (this.frasesFixasPorAmbiente[this.novoAmbiente.nome]) {
      this.novoAmbiente.frases = [...this.frasesFixasPorAmbiente[this.novoAmbiente.nome]];
    } else {
      this.novoAmbiente.frases = [{ pronome: 'Il', verbo: 'est', complemento: 'là', resposta: 'est' }];  // Frase padrão
    }
  
    this.crudService.addAmbiente(this.novoAmbiente).subscribe(() => {
      this.carregarAmbientes();
      this.closeModal();
    }, error => {
      console.error('Erro ao adicionar o ambiente', error);
    });
  }
  

  // Excluir ambiente
  deleteAmbiente(index: number): void {
    const ambiente = this.ambientes[index];
    if (ambiente?.id) {
      this.crudService.deleteAmbiente(ambiente.id).subscribe(() => {
        this.carregarAmbientes();
      });
    }
  }

  // Modal para adicionar ou editar frases
  openFraseModal(index: number): void {
    this.novaFrase = { pronome: '', verbo: '', complemento: '', resposta: '' };
    this.ambienteSelecionadoIndex = index;
    this.fraseEditandoIndex = -1;
    this.isEditingFrase = false;
    this.isFraseModalOpen = true;
  }

  // Editar frase
  editFrase(ambienteIndex: number, fraseIndex: number): void {
    const frase = this.ambientes[ambienteIndex].frases[fraseIndex];
    this.novaFrase = { ...frase };
    this.ambienteSelecionadoIndex = ambienteIndex;
    this.fraseEditandoIndex = fraseIndex;
    this.isEditingFrase = true;
    this.isFraseModalOpen = true;
  }

  // Salvar frase (adicionar ou editar)
  saveFrase(): void {
    const ambiente = this.ambientes[this.ambienteSelecionadoIndex];
    if (!ambiente) return;

    if (this.isEditingFrase && this.fraseEditandoIndex >= 0) {
      ambiente.frases[this.fraseEditandoIndex] = { ...this.novaFrase };
    } else {
      ambiente.frases.push({ ...this.novaFrase });
    }

    this.crudService.updateAmbiente(ambiente).subscribe(() => {
      this.closeModal();
    });
  }

  // Excluir frase
  deleteFrase(ambienteIndex: number, fraseIndex: number): void {
    const ambiente = this.ambientes[ambienteIndex];
    if (!ambiente || !ambiente.frases[fraseIndex]) return;

    ambiente.frases.splice(fraseIndex, 1);
    this.crudService.updateAmbiente(ambiente).subscribe(() => {
      this.carregarAmbientes();
    });
  }

  // Fechar os modais
  closeModal(): void {
    this.isAmbienteModalOpen = false;
    this.isFraseModalOpen = false;
    this.novaFrase = { pronome: '', verbo: '', complemento: '', resposta: '' };
    this.isEditingFrase = false;
    this.fraseEditandoIndex = -1;
  }

  // Lidar com a seleção de imagens para fundo
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
