import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  currentYear: number = new Date().getFullYear();
  userName: string = '';
  logoUrl: string = 'https://res.cloudinary.com/dqofgewng/image/upload/v1744890405/Test-Logo-Circle-black-transparent_nrbdhd.png';

  constructor() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      this.userName = parsed.nombre || parsed.name || 'Usuario';
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  goHome(): void {
    window.location.href = '/';
  }
}