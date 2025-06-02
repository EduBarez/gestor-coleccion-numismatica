// collectionDetalle.component.ts
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
import { MatIconModule } from '@angular/material/icon';
import { FiltrosMonedas } from '@app/models/moneda.models';

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
    MatIconModule,
  ],
  templateUrl: './coleccionDetalle.component.html',
  styleUrls: ['./coleccionDetalle.component.scss'],
})
export class ColeccionDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public coleccionService = inject(ColeccionService);
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
    this.filterForm = this.fb.group<FiltrosMonedas>({
      search: '',
      autoridad_emisora: '',
      ceca: '',
      datacion: '',
      estado_conservacion: '',
      metal: '',
    });
  }

  ngOnInit(): void {
    this.filterForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      this.pageIndex = 0;
      this.applyFilter();
    });

    this.applyFilter();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) return;
      this.loadColeccion(id);
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

  // public applyFilter(): void {
  //   const term = (this.filterForm.get('search')?.value || '')
  //     .trim()
  //     .toLowerCase();
  //   const filtered = term
  //     ? this.monedasFull.filter((m) => m.nombre.toLowerCase().includes(term))
  //     : [...this.monedasFull];

  //   this.totalItems = filtered.length;
  //   const start = this.pageIndex * this.pageSize;
  //   this.monedas = filtered.slice(start, start + this.pageSize);
  // }
  public applyFilter(): void {
    // Se extraen todos los valores de filtro del formulario
    const {
      search,
      autoridad_emisora,
      ceca,
      datacion,
      estado_conservacion,
      metal,
    } = this.filterForm.value as FiltrosMonedas;

    // Se normalizan a minúsculas y sin espacios innecesarios
    const term = (search || '').trim().toLowerCase();
    const emisor = (autoridad_emisora || '').trim().toLowerCase();
    const cecaTerm = (ceca || '').trim().toLowerCase();
    const fechaTerm = (datacion || '').trim().toLowerCase();
    const estadoTerm = (estado_conservacion || '').trim().toLowerCase();
    const metalTerm = (metal || '').trim().toLowerCase();

    // Filtrado encadenado: solo se consideran las monedas que cumplan
    // TODAS las condiciones activas (si el campo está vacío, se omite esa condición)
    const filtered = this.monedasFull.filter((m) => {
      // Para cada moneda, obtenemos el valor correspondiente y lo normalizamos
      const nombreLower = m.nombre?.toLowerCase() || '';
      const emisorLower = m.autoridad_emisora?.toLowerCase() || '';
      const cecaLower = m.ceca?.toLowerCase() || '';
      const datacionLower = m.datacion?.toString().toLowerCase() || '';
      const estadoLower = m.estado_conservacion?.toLowerCase() || '';
      const metalLower = m.metal?.toLowerCase() || '';

      // Comprobamos cada filtro de forma independiente
      let matches = true;

      if (term) {
        matches = matches && nombreLower.includes(term);
      }
      if (emisor) {
        matches = matches && emisorLower.includes(emisor);
      }
      if (cecaTerm) {
        matches = matches && cecaLower.includes(cecaTerm);
      }
      if (fechaTerm) {
        matches = matches && datacionLower.includes(fechaTerm);
      }
      if (estadoTerm) {
        matches = matches && estadoLower.includes(estadoTerm);
      }
      if (metalTerm) {
        matches = matches && metalLower.includes(metalTerm);
      }

      return matches;
    });

    // Actualizamos el total de resultados para el paginador
    this.totalItems = filtered.length;

    // Calculamos el slice correspondiente a la página actual
    const start = this.pageIndex * this.pageSize;
    this.monedas = filtered.slice(start, start + this.pageSize);
  }
}
