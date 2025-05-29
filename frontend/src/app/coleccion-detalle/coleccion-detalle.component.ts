import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { ColeccionService } from '@app/services/coleccion.service';
import { UserService } from '@app/services/user.service';
import { Coleccion } from '@app/models/coleccion.model';

@Component({
  selector: 'app-coleccion-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCardModule,
  ],
  templateUrl: './coleccion-detalle.component.html',
  styleUrls: ['./coleccion-detalle.component.scss'],
})
export class ColeccionDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private coleccionService = inject(ColeccionService);
  public userService = inject(UserService);

  coleccion?: Coleccion;
  monedasFull: any[] = [];
  monedas: any[] = [];
  totalItems = 0;
  pageSize = 8;
  pageIndex = 0;

  filterForm: FormGroup;
  showFilters = false;
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({ search: [''] });
  }

  ngOnInit(): void {
    // 1. Leer id de la ruta
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) return;
      this.loadColeccion(id);
    });

    // 2. Filtros reactivos
    this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.applyFilter();
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.applyFilter();
  }

  private loadColeccion(id: string): void {
    this.isLoading = true;
    this.coleccionService.getColeccionById(id).subscribe({
      next: ({ coleccion, monedas }) => {
        this.coleccion = coleccion;
        this.monedasFull = monedas;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando colección', err);
        this.isLoading = false;
      },
    });
  }

  public applyFilter(): void {
    const term = (this.filterForm.get('search')?.value || '')
      .trim()
      .toLowerCase();
    const filtered = term
      ? this.monedasFull.filter((m) => m.nombre.toLowerCase().includes(term))
      : [...this.monedasFull];

    this.totalItems = filtered.length;
    const start = this.pageIndex * this.pageSize;
    this.monedas = filtered.slice(start, start + this.pageSize);
  }
}
