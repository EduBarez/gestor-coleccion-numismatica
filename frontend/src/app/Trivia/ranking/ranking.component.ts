import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { RankingService } from '@app/services/ranking.service';
import { TriviaService } from '@app/services/trivia.service';
import { Ranking } from '@app/models/ranking.model';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
})
export class RankingComponent implements OnInit {
  topRanking: Ranking[] = [];
  periodos: string[] = [];
  selectedPeriodo: string = '';

  constructor(
    private rankingService: RankingService,
    private triviaService: TriviaService
  ) {}

  ngOnInit(): void {
    this.triviaService.getPeriodos().subscribe({
      next: (periodos) => (this.periodos = periodos),
      error: () => (this.periodos = []),
    });
    this.cargarRanking();
  }

  cargarRanking(): void {
    this.rankingService
      .getTopRanking(10, this.selectedPeriodo || undefined)
      .subscribe({
        next: (ranking) => (this.topRanking = ranking),
        error: () => (this.topRanking = []),
      });
  }

  getNombreUsuario(usuario: any): string {
    if (!usuario) return '';
    if (typeof usuario === 'string') return usuario;
    if ('nombre' in usuario) return usuario.nombre;
    return '';
  }
}
