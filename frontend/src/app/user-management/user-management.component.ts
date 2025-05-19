import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-management',
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
      next: (list: User[]) => {
        this.pendientes = list;
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
  approve(user: User): void {
    this.userService.approve(user.id).subscribe({
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
  reject(user: User): void {
    this.userService.reject(user.id).subscribe({
      next: () => {
        this.message = `Usuario ${user.nombre} rechazado y eliminado.`;
        this.error = '';
        this.loadPendings();
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al rechazar usuario';
      },
    });
  }
}
