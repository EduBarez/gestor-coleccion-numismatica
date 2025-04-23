import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  currentYear: number = new Date().getFullYear();
  userName: string = '';
  logoUrl: string = 'https://res.cloudinary.com/dqofgewng/image/upload/v1744890405/Test-Logo-Circle-black-transparent_nrbdhd.png';

  constructor(private router: Router) {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.userName = JSON.parse(userData).nombre;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
