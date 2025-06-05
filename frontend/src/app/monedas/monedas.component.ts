import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonedaService } from '../services/monedas.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import {
  Moneda,
  MonedaResponse,
  FiltrosMonedas,
} from '../models/moneda.models';
import { UserService } from '@app/services/user.service';

@Component({
  selector: 'app-monedas',
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
  ],
  templateUrl: './monedas.component.html',
  styleUrls: ['./monedas.component.scss'],
})
export class MonedasComponent implements OnInit {
  private monedaService = inject(MonedaService);

  showFilters = false;
  filterForm: FormGroup;
  monedas: Moneda[] = [];
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;

  constructor(private fb: FormBuilder, public userService: UserService) {
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
      this.getMonedas();
    });

    this.getMonedas();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  getMonedas(): void {
    const filtros = this.filterForm.value as FiltrosMonedas;

    this.monedaService
      .getMonedas(this.pageIndex + 1, this.pageSize, filtros)
      .subscribe({
        next: (resp: MonedaResponse) => {
          this.monedas = resp.monedas;
          this.totalItems = resp.total;
          this.pageIndex = resp.page - 1;
          this.pageSize = resp.limit;
        },
        error: (err) => console.error('Error cargando monedas', err),
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getMonedas();
  }
}
