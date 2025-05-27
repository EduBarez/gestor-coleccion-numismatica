import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

// Módulos de Angular Material usados en el template
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-user-management',
  standalone: true, // Componente standalone
  imports: [
    NgIf,
    NgFor,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  // Lista de usuarios pendientes de aprobación
  pendientes: User[] = [];
  // Mensajes de éxito o error
  message: string = '';
  error: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadPendings();
  }

  /**
   * Carga los usuarios cuyo campo isApproved es false
   */
  loadPendings(): void {
    this.userService.getPending().subscribe({
      next: (list: any[]) => {
        this.pendientes = list.map((u) => ({
          ...u,
          id: u._id,
        }));
        this.error = '';
      },
      error: (err) => {
        this.error =
          err.error?.error || 'No se pudieron cargar usuarios pendientes';
      },
    });
  }

  /**
   * Aprueba un usuario y recarga la lista
   */
  approve(userId: string): void {
    this.userService.approve(userId).subscribe({
      next: (u: User) => {
        this.message = `Usuario ${u.nombre} aprobado correctamente.`;
        this.error = '';
        this.loadPendings();
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al aprobar usuario';
      },
    });
  }

  /**
   * Rechaza (elimina) un usuario y recarga la lista
   */
  reject(userId: string): void {
    this.userService.reject(userId).subscribe({
      next: () => {
        this.message = `Usuario ${userId} rechazado y eliminado.`;
        this.error = '';
        this.loadPendings();
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al rechazar usuario';
      },
    });
  }
}
