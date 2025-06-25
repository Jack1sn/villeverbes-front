// src/app/services/redefinir-senha.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RedefinirSenhaPayload {
  email: string;
  senhaAtual: string;
  novaSenha: string;
}

@Injectable({
  providedIn: 'root'
})
export class RedefinirSenhaService {
  private readonly API_URL = 'http://localhost:8080/api/auth/redefinir-senha';

  constructor(private http: HttpClient) {}

  redefinirSenha(payload: RedefinirSenhaPayload): Observable<any> {
    return this.http.post(this.API_URL, payload);
  }
}
