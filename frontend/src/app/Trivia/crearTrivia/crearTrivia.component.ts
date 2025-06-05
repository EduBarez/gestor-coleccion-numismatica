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
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { TriviaService } from '@app/services/trivia.service';
import { Trivia } from '@app/models/trivia.model';

@Component({
  selector: 'app-crear-trivia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './crearTrivia.component.html',
  styleUrls: ['./crearTrivia.component.scss'],
})
export class CrearTriviaComponent {
  form: FormGroup;
  message = '';

  constructor(
    private fb: FormBuilder,
    private triviaService: TriviaService,
    private router: Router
  ) {
    // Definimos el formulario con los campos necesarios
    this.form = this.fb.group({
      pregunta: ['', Validators.required],
      opcion1: ['', Validators.required],
      opcion2: ['', Validators.required],
      opcion3: ['', Validators.required],
      opcion4: ['', Validators.required],
      respuestaCorrecta: ['', Validators.required],
      periodo: ['', Validators.required],
    });
  }

  /**
   * Si el usuario pulsa “Cancelar”, volvemos al listado de trivia.
   */
  cancel(): void {
    this.router.navigate(['/trivia']);
  }

  /**
   * Al enviar el formulario:
   * 1. Construimos el payload en base al modelo Trivia.
   * 2. Llamamos a triviaService.createPregunta(...)
   */
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // 1. Leer los valores de cada control
    const {
      pregunta,
      opcion1,
      opcion2,
      opcion3,
      opcion4,
      respuestaCorrecta,
      periodo,
    } = this.form.value;

    // 2. Montar el objeto de tipo Omit<Trivia, '_id'>
    const nuevaPregunta: Omit<Trivia, '_id'> = {
      pregunta: pregunta.trim(),
      opciones: [
        opcion1.trim(),
        opcion2.trim(),
        opcion3.trim(),
        opcion4.trim(),
      ],
      respuestaCorrecta: respuestaCorrecta,
      periodo: periodo.trim(),
    };

    // 3. Llamar al servicio para crearla
    this.triviaService.createPregunta(nuevaPregunta).subscribe({
      next: (resp) => {
        // Al crear correctamente, redirigimos al listado de trivia
        this.router.navigate(['/trivia']);
      },
      error: (err) => {
        this.message =
          err.error?.error || 'Error al crear la pregunta de trivia';
      },
    });
  }
}
