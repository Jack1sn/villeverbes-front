import { Injectable } from '@angular/core';
import axios from 'axios';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  private baseUrl = 'http://localhost:8080';

  constructor() {}

  async buscarFuncionariosRedirecionamento(id: number): Promise<Usuario[]> {
    const url = `${this.baseUrl}/funcionarios/redirecionar/${id}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async listarTodos(): Promise<Usuario[]> {
    const url = `${this.baseUrl}/funcionarios`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  atualizarFuncionario = async (funcionario: Usuario): Promise<Usuario> => {
    const url = `${this.baseUrl}/usuarios/${funcionario.id}`;
    try {
      const response = await axios.put(url, funcionario);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  removerFuncionario = async (idFuncionario: number): Promise<void> => {
    const url = `${this.baseUrl}/usuarios/${idFuncionario}`;
    try {
      await axios.delete(url);
    } catch (error) {
      throw error;
    }
  };

  criarFuncionario = async (funcionario: any): Promise<Usuario> => {
    const url = `${this.baseUrl}/usuarios`;
    try {
      const postData = {
        nome: funcionario.nome,
        email: funcionario.email,
        perfil: 'FUNCIONARIO',
        dataNascimento: funcionario.dataNascimento,
        cpf: '',
        telefone: '',
        cep: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
      };
      const response = await axios.post(url, postData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}
