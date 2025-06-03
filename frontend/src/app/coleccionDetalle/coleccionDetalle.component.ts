import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { ColeccionService } from '@app/services/coleccion.service';
import { UserService } from '@app/services/user.service';
import { Coleccion } from '@app/models/coleccion.model';
import { FiltrosMonedas, Moneda } from '@app/models/moneda.models';

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
  private router = inject(Router);
  public coleccionService = inject(ColeccionService);
  public userService = inject(UserService);

  public coleccion?: Coleccion;
  public monedasFull: Moneda[] = [];
  public monedas: Moneda[] = [];
  public totalItems = 0;
  public pageSize = 8;
  public pageIndex = 0;

  public filterForm: FormGroup;
  public showFilters = false;
  public isLoading = false;

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

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.router.navigate(['/colecciones']);
        return;
      }
      this.loadColeccion(id);
    });
  }

  private loadColeccion(id: string): void {
    this.isLoading = true;
    this.coleccionService.getColeccionById(id).subscribe({
      next: (res) => {
        this.coleccion = res.coleccion;
        this.monedasFull = Array.isArray(res.coleccion.monedas)
          ? res.coleccion.monedas
          : [];
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
    const {
      search,
      autoridad_emisora,
      ceca,
      datacion,
      estado_conservacion,
      metal,
    } = this.filterForm.value as FiltrosMonedas;

    const term = (search || '').trim().toLowerCase();
    const emisor = (autoridad_emisora || '').trim().toLowerCase();
    const cecaTerm = (ceca || '').trim().toLowerCase();
    const fechaTerm = (datacion || '').trim().toLowerCase();
    const estadoTerm = (estado_conservacion || '').trim().toLowerCase();
    const metalTerm = (metal || '').trim().toLowerCase();

    const filtered = this.monedasFull.filter((m) => {
      const nombreLower = m.nombre?.toLowerCase() || '';
      const emisorLower = m.autoridad_emisora?.toLowerCase() || '';
      const cecaLower = m.ceca?.toLowerCase() || '';
      const datacionLower = m.datacion?.toString().toLowerCase() || '';
      const estadoLower = m.estado_conservacion?.toLowerCase() || '';
      const metalLower = m.metal?.toLowerCase() || '';

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

    this.totalItems = filtered.length;
    const start = this.pageIndex * this.pageSize;
    this.monedas = filtered.slice(start, start + this.pageSize);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.applyFilter();
  }

  public openConfirmDialog(): void {
    if (!this.coleccion) {
      console.error('Colección no encontrada.');
      return;
    }
    const confirmado = window.confirm(
      '¿Estás seguro de que quieres borrar la colección actual?'
    );
    if (!confirmado) {
      return;
    }
    this.coleccionService.deleteColeccion(this.coleccion._id).subscribe({
      next: () => {
        this.router.navigate(['/colecciones']);
      },
      error: (err) => {
        console.error('Error al eliminar la colección:', err);
      },
    });
  }
}
