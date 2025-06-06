import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-aprobar-rechazar',
  standalone: true,
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
  templateUrl: './aprobarRechazar.component.html',
  styleUrls: ['./aprobarRechazar.component.scss'],
})
export class AprobarRechazarComponent implements OnInit {
  pendientes: User[] = [];
  message: string = '';
  error: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadPendings();
  }

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
