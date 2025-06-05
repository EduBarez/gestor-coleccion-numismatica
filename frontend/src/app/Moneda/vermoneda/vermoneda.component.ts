// vermoneda.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MonedaService } from '@app/services/monedas.service';
import { Moneda } from '@app/models/moneda.models';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '@app/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '@app/services/notification.service';
import { Notification } from '@app/models/notificacion.model';

@Component({
  selector: 'app-vermoneda',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCardModule,
    RouterModule,
    MatIconModule,
  ],
  templateUrl: './vermoneda.component.html',
  styleUrls: ['./vermoneda.component.scss'],
})
export class VermonedaComponent implements OnInit {
  moneda: Moneda | null = null;
  cargando = true;
  error: string | null = null;
  nombreUsuario: string = '';
  coleccionId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private monedasService: MonedaService,
    public userService: UserService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.coleccionId = this.route.snapshot.queryParamMap.get('coleccionId');
    const id = this.route.snapshot.paramMap.get('id')!;
    this.monedasService.getMonedaById(id).subscribe({
      next: (m) => {
        this.getNombreApellido(m.propietario);
        this.moneda = m;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la moneda.';
        this.cargando = false;
      },
    });
  }

  getNombreApellido(id: string): void {
    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.nombreUsuario = user.nombre + ' ' + user.apellidos;
      },
      error: () => {
        this.nombreUsuario = 'Usuario no encontrado';
      },
    });
  }

  onDeleteMoneda(id: string) {
    const confirmado = window.confirm(
      '¿Estás seguro de que quieres borrar la moneda?'
    );
    if (!confirmado) {
      return;
    }

    const isAdmin = this.userService.isAdmin();
    const isPropietario = this.moneda
      ? this.userService.isPropietario(this.moneda.propietario)
      : false;

    this.monedasService.deleteMoneda(id).subscribe({
      next: () => {
        if (isAdmin && !isPropietario && this.moneda) {
          const fechaHora = new Date().toLocaleString();
          const mensaje = `Un administrador te ha eliminado la moneda: ${this.moneda.nombre} - ${this.moneda.autoridad_emisora}, Referencias: ${this.moneda.referencias}) el ${fechaHora}`;
          const nuevaNotificacion: Notification = {
            userId: this.moneda.propietario,
            message: mensaje,
            date: new Date().toISOString(),
            viewed: false,
          };
          this.notificationService
            .createNotification(nuevaNotificacion)
            .subscribe();
        }
        this.router.navigate(['/monedas']);
      },
      error: (err) => {
        console.error('Error al borrar moneda:', err);
        alert('No se pudo borrar la moneda. Intenta de nuevo.');
      },
    });
  }
}
