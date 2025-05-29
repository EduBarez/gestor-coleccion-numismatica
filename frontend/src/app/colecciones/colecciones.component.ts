import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

import {
  ColeccionService,
  FiltrosColecciones,
} from '@app/services/coleccion.service';
import { Coleccion } from '@app/models/coleccion.model';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-colecciones',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCardModule,
    RouterModule,
  ],
  templateUrl: './colecciones.component.html',
  styleUrls: ['./colecciones.component.scss'],
})
export class ColeccionesComponent implements OnInit {
  private coleccionService = inject(ColeccionService);

  filterForm: FormGroup;
  colecciones: Coleccion[] = [];
  totalItems = 0;
  pageSize = 8;
  pageIndex = 0;
  showFilters = false;

  constructor(private fb: FormBuilder, public userService: UserService) {
    this.filterForm = this.fb.group<FiltrosColecciones>({ search: '' });
  }

  ngOnInit(): void {
    // Cuando cambien valores de filtro, reiniciamos página y recargamos
    this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.getColecciones();
    });

    // Carga inicial
    this.getColecciones();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  getColecciones(): void {
    const filtros = this.filterForm.value as FiltrosColecciones;
    this.coleccionService.getPublicas().subscribe({
      next: (cols) => {
        const term = filtros.search?.trim().toLowerCase() || '';
        const filtradas = term
          ? cols.filter((c) => c.nombre.toLowerCase().includes(term))
          : cols;
        this.totalItems = filtradas.length;

        const start = this.pageIndex * this.pageSize;
        this.colecciones = filtradas.slice(start, start + this.pageSize);
      },
      error: (err) => console.error('Error cargando colecciones', err),
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getColecciones();
  }
}
