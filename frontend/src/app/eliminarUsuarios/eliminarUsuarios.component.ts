import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-eliminar-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
  ],
  templateUrl: './eliminarUsuarios.component.html',
  styleUrls: ['./eliminarUsuarios.component.scss'],
})
export class EliminarUsuariosComponent implements OnInit {
  usuarios: User[] = [];
  loading = false;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.usuarios = users;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar usuarios';
        this.loading = false;
      },
    });
  }

  eliminarUsuario(user: User) {
    if (
      confirm(
        `¿Seguro que quieres eliminar a ${user.nombre} ${user.apellidos}? Esta acción es irreversible.`
      )
    ) {
      this.userService.deleteUserCascade(user._id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter((u) => u._id !== user._id);
        },
        error: () => {
          this.error = 'Error al eliminar el usuario';
        },
      });
    }
  }
}
