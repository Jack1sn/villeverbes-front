import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // ✅ Importa a URL do ambiente

// Interface com os dados necessários para redefinir a senha
export interface RedefinirSenhaPayload {
  email: string;
  senhaAtual: string;
  novaSenha: string;
}

@Injectable({
  providedIn: 'root'
})
export class RedefinirSenhaService {
  // ✅ Usa a API do ambiente (localhost para dev, Railway para prod)
  private readonly API_URL = `${environment.apiUrl}/api/auth/redefinir-senha`;

  constructor(private http: HttpClient) {}

  /**
   * Envia a requisição para redefinir a senha de um usuário.
   * @param payload Objeto contendo email, senha atual e nova senha.
   */
  redefinirSenha(payload: RedefinirSenhaPayload): Observable<any> {
    return this.http.post(this.API_URL, payload);
  }
}
