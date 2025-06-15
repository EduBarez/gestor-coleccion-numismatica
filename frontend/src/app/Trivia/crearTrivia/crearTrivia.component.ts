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
  periodos: string[] = [];

  constructor(
    private fb: FormBuilder,
    private triviaService: TriviaService,
    private router: Router
  ) {
    this.form = this.fb.group({
      pregunta: ['', Validators.required],
      opcion1: ['', Validators.required],
      opcion2: ['', Validators.required],
      opcion3: ['', Validators.required],
      opcion4: ['', Validators.required],
      respuestaCorrecta: ['', Validators.required],
      periodo: ['', Validators.required],
    });

    this.form.valueChanges.subscribe(() => {
      const respuestaActual = this.form.get('respuestaCorrecta')?.value;
      const opcion1 = this.form.get('opcion1')?.value;
      if ((!respuestaActual || respuestaActual === '') && opcion1) {
        this.form
          .get('respuestaCorrecta')
          ?.setValue(opcion1, { emitEvent: false });
      }
    });

    this.triviaService.getPeriodos().subscribe({
      next: (periodos) => (this.periodos = periodos),
      error: () => (this.periodos = []),
    });
  }

  cancel(): void {
    this.router.navigate(['/trivia']);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {
      pregunta,
      opcion1,
      opcion2,
      opcion3,
      opcion4,
      respuestaCorrecta,
      periodo,
    } = this.form.value;

    const periodoFinal = periodo.trim();

    const nuevaPregunta: Omit<Trivia, '_id'> = {
      pregunta: pregunta.trim(),
      opciones: [
        opcion1.trim(),
        opcion2.trim(),
        opcion3.trim(),
        opcion4.trim(),
      ],
      respuesta_correcta: respuestaCorrecta,
      periodo: periodoFinal,
    };

    this.triviaService.createPregunta(nuevaPregunta).subscribe({
      next: (resp) => {
        this.router.navigate(['/trivia-examen']);
      },
      error: (err) => {
        this.message =
          err.error?.error || 'Error al crear la pregunta de trivia';
      },
    });
  }
}
