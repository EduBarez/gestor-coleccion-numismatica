import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '@app/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterModule,
    NgIf,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  currentYear = new Date().getFullYear();
  userName = localStorage.getItem('userName') || '';
  userRol = localStorage.getItem('userRole') || '';

  constructor(private router: Router, public userService: UserService) {
    if (this.userRol === 'user') this.userRol = 'Usuario';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    this.router.navigate(['/']);
  }
}
