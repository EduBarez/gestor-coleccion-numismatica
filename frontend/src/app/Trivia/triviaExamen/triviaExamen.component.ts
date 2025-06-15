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
import { RankingService } from '../../services/ranking.service';
import { Ranking } from '@app/models/ranking.model';

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
  modoExamen: 'all' | 'periodo' = 'all';
  examStarted = false;
  examFinished = false;

  periodos: string[] = [];
  selectedPeriodo: string = '';
  preguntasDisponibles: Trivia[] = [];
  preguntasExamen: Trivia[] = [];
  respuestasUsuario: { [preguntaId: string]: string } = {};

  startTime!: Date;
  endTime!: Date;
  tiempoSegundos: number = 0;
  puntuacion: number = 0;
  correctCount: number = 0;

  constructor(
    private triviaService: TriviaService,
    private rankingService: RankingService
  ) {}

  ngOnInit(): void {
    this.triviaService.getPeriodos().subscribe({
      next: (periodos) => (this.periodos = periodos),
      error: () => (this.periodos = []),
    });

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
    this.tiempoSegundos = Math.floor(
      (this.endTime.getTime() - this.startTime.getTime()) / 1000
    );

    let aciertos = 0;
    this.preguntasExamen.forEach((p) => {
      const respuesta = this.respuestasUsuario[p._id!];
      if (respuesta && respuesta === p.respuestaCorrecta) {
        aciertos++;
      }
    });
    this.correctCount = aciertos;

    if (this.tiempoSegundos > 0) {
      this.puntuacion = parseFloat(
        ((aciertos * 1000) / this.tiempoSegundos).toFixed(2)
      );
    } else {
      this.puntuacion = aciertos * 1000;
    }

    this.examFinished = true;

    const idUsuario = this.getUsuarioId?.();
    if (idUsuario) {
      this.rankingService
        .addRanking({
          puntuacion: this.puntuacion,
          aciertos: this.correctCount,
          totalPreguntas: this.preguntasExamen.length,
          tiempoSegundos: this.tiempoSegundos,
          periodo: this.modoExamen === 'periodo' ? this.selectedPeriodo : null,
        })
        .subscribe();
    }
  }

  private getUsuarioId(): string | null {
    return localStorage.getItem('userId');
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
