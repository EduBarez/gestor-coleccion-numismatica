import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, NgIf, MatToolbarModule, MatButtonModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  currentYear = new Date().getFullYear();
  userName = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        const user = JSON.parse(raw) as { nombre: string };
        this.userName = user.nombre;
      } catch {
        this.userName = '';
      }
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }
}
