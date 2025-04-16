import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  
  styleUrls: ['./home.component.css'],
  imports: [  CommonModule ,HeaderComponent]
})
export class HomeComponent {
  constructor(private router: Router) {}

 
    navigate(destino: string): void {
      this.router.navigate(['/' + destino]);
    }
  }
