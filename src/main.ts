///<reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';  
import { provideRouter } from '@angular/router';  
import { AppComponent } from './app/app.component';  
import { routes } from './app/app.routes';  
import { provideZoneChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),  
    provideRouter(routes) , 
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
})
  .catch((err) => console.error(err));
