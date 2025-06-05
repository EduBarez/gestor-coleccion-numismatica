import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ColeccionService } from '@app/services/coleccion.service';
import { Coleccion } from '@app/models/coleccion.model';

@Component({
  selector: 'app-crear-coleccion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './crearcoleccion.component.html',
  styleUrls: ['./crearcoleccion.component.scss'],
})
export class CrearColeccionComponent {
  form: FormGroup;
  message = '';

  constructor(
    private fb: FormBuilder,
    private coleccionService: ColeccionService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      publica: [false],
    });
  }

  cancel(): void {
    this.router.navigate(['/colecciones']);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data: {
      nombre: string;
      descripcion?: string;
      publica: boolean;
    } = this.form.value;

    this.coleccionService.createColeccion(data).subscribe({
      next: (newCol: Coleccion) => {
        this.message = 'Colección creada correctamente';
        this.router.navigate(['/colecciones']);
      },
      error: (err) => {
        this.message = err.error?.message || 'Error al crear la colección';
      },
    });
  }
}
