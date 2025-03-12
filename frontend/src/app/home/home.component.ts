import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,  // Permite usar directivas como *ngIf, *ngFor, etc.
    RouterModule   // Necesario para usar routerLink
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // Estado simulado de autenticación; en un caso real vendría de un servicio.
  isLoggedIn = false;

  // Aquí podrías agregar métodos para navegar, iniciar sesión, etc.
}
