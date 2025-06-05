import { Component, OnInit } from '@angular/core';
import { TriviaService } from '@app/services/trivia.service';
import { Trivia } from '@app/models/trivia.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trivia-examen',
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
    MatRadioModule,
    FormsModule,
  ],
  templateUrl: './triviaExamen.component.html',
  styleUrls: ['./triviaExamen.component.scss'],
})
export class TriviaExamenComponent implements OnInit {
  // ----- CONTROL DE VISTAS -----
  modoExamen: 'all' | 'periodo' = 'all';
  examStarted = false;
  examFinished = false;

  // ----- LISTADOS Y SELECCIONES -----
  periodos: string[] = [];
  selectedPeriodo: string = '';
  preguntasDisponibles: Trivia[] = [];
  preguntasExamen: Trivia[] = [];
  // Para almacenar las respuestas del usuario: clave = _id de la pregunta, valor = opción elegida
  respuestasUsuario: { [preguntaId: string]: string } = {};

  // ----- TIEMPO Y PUNTUACIÓN -----
  startTime!: Date;
  endTime!: Date;
  tiempoSegundos: number = 0;
  puntuacion: number = 0;
  correctCount: number = 0;

  constructor(private triviaService: TriviaService) {}

  ngOnInit(): void {
    this.triviaService.getPreguntas().subscribe(
      (allPreguntas) => {
        this.preguntasDisponibles = allPreguntas;
        const setPeriodos = new Set<string>();
        allPreguntas.forEach((p) => {
          if (p.periodo) {
            setPeriodos.add(p.periodo);
          }
        });
        this.periodos = Array.from(setPeriodos).sort();
      },
      (err) => {
        console.error('Error obteniendo preguntas:', err);
      }
    );
  }

  empezarExamen(): void {
    this.respuestasUsuario = {};
    this.preguntasExamen = [];

    this.startTime = new Date();
    this.examStarted = true;

    if (this.modoExamen === 'all') {
      this.seleccionarPreguntasAleatorias(this.preguntasDisponibles);
    } else {
      this.triviaService.getPreguntasPorPeriodo(this.selectedPeriodo).subscribe(
        (pregsPeriodo) => {
          this.seleccionarPreguntasAleatorias(pregsPeriodo);
        },
        (err) => {
          console.error('Error al obtener preguntas por periodo:', err);
        }
      );
    }
  }

  private seleccionarPreguntasAleatorias(pregs: Trivia[]): void {
    const copia = [...pregs];
    const seleccion: Trivia[] = [];

    while (seleccion.length < 10 && copia.length > 0) {
      const idx = Math.floor(Math.random() * copia.length);
      seleccion.push(copia[idx]);
      copia.splice(idx, 1);
    }

    this.preguntasExamen = seleccion;
    seleccion.forEach((p) => {
      this.respuestasUsuario[p._id!] = '';
    });
  }

  finalizarExamen(): void {
    this.endTime = new Date();
    // Tiempo en segundos (redondeado)
    this.tiempoSegundos = Math.floor(
      (this.endTime.getTime() - this.startTime.getTime()) / 1000
    );

    // Contar aciertos
    let aciertos = 0;
    this.preguntasExamen.forEach((p) => {
      const respuesta = this.respuestasUsuario[p._id!];
      if (respuesta && respuesta === p.respuestaCorrecta) {
        aciertos++;
      }
    });
    this.correctCount = aciertos;

    // Cálculo de puntuación: (aciertos * 1000) / tiempoSegundos
    // + Se multiplica por 1000 para escalar la puntuación
    // + Ganar más puntos si responde más rápido
    if (this.tiempoSegundos > 0) {
      this.puntuacion = parseFloat(
        ((aciertos * 1000) / this.tiempoSegundos).toFixed(2)
      );
    } else {
      // Evitar división por cero; si tarda menos de 1s, damos la máxima puntuación teórica
      this.puntuacion = aciertos * 1000;
    }

    this.examFinished = true;
  }

  reiniciar(): void {
    this.modoExamen = 'all';
    this.selectedPeriodo = '';
    this.examStarted = false;
    this.examFinished = false;
    this.respuestasUsuario = {};
    this.preguntasExamen = [];
    this.puntuacion = 0;
    this.correctCount = 0;
    this.tiempoSegundos = 0;
  }
}
