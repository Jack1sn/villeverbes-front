///<reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';  // Para o HttpClient
import { provideRouter } from '@angular/router';  // Para as rotas
import { AppComponent } from './app/app.component';  // Seu componente principal
import { routes } from './app/app.routes';  // Suas rotas (caso tenha configurado)

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),  // Habilita o HttpClient para a aplicação
    provideRouter(routes)  // As rotas (caso tenha configurado)
  ]
})
  .catch((err) => console.error(err));
