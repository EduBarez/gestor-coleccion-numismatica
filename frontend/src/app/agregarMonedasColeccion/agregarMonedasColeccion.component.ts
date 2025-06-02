import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ColeccionService } from '@app/services/coleccion.service';
import { MonedaService } from '@app/services/monedas.service';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-agregar-monedas',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatListModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './agregarMonedasColeccion.component.html',
  styleUrls: ['./agregarMonedasColeccion.component.scss'],
})
export class AgregarMonedasComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private coleccionService = inject(ColeccionService);
  private monedaService = inject(MonedaService);
  private fb = inject(FormBuilder);

  public isLoading: boolean = false;
  public collectionId!: string;
  public todasMisMonedas: any[] = [];
  public monedasEnColeccion: any[] = [];
  public formSeleccion: FormGroup;

  constructor() {
    // Inicialización del FormGroup con un FormArray vacío
    this.formSeleccion = this.fb.group({
      seleccion: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.router.navigate(['/colecciones']);
        return;
      }
      this.collectionId = id;
      this.cargarMonedasDelUsuario();
    });
  }

  private cargarMonedasDelUsuario(): void {
    this.isLoading = true;

    this.monedaService.getMisMonedas().subscribe({
      next: (monedasUsuario: any[]) => {
        this.todasMisMonedas = monedasUsuario;

        this.coleccionService.getColeccionById(this.collectionId).subscribe({
          next: (res) => {
            // Ajustar según la estructura exacta del JSON:
            // Si el backend devolvía { coleccion: {..., monedas: [...] } }:
            //   this.monedasEnColeccion = res.coleccion.monedas || [];
            // Si devolvía directamente { _id, nombre, ..., monedas: [...] }:
            this.monedasEnColeccion = Array.isArray(res.monedas)
              ? res.monedas
              : [];

            const idsEnColeccion = new Set(
              this.monedasEnColeccion.map((m) => m._id)
            );
            this.todasMisMonedas = this.todasMisMonedas.filter(
              (m) => !idsEnColeccion.has(m._id)
            );

            this.inicializarFormArray();
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error al obtener monedas ya en la colección', err);
            this.isLoading = false;
          },
        });
      },
      error: (err) => {
        console.error('Error al cargar monedas del usuario', err);
        this.isLoading = false;
      },
    });
  }

  private inicializarFormArray(): void {
    const controlArray = this.formSeleccion.get('seleccion') as FormArray;
    // Se eliminaron controles previos (en caso de recarga)
    while (controlArray.length !== 0) {
      controlArray.removeAt(0);
    }
    // Por cada moneda (que NO está en la colección), agregar un control booleano inicializado en false
    this.todasMisMonedas.forEach(() =>
      controlArray.push(this.fb.control(false))
    );
  }

  /**
   * Getter que devuelve true si NO hay ninguna casilla marcada.
   * Se usó en el template en vez de arrow function.
   */
  public get ningunCheckboxSeleccionado(): boolean {
    const controlArray = this.formSeleccion.get('seleccion') as FormArray;
    return controlArray.controls.every((ctrl) => !ctrl.value);
  }

  /**
   * Construyó la lista de IDs de monedas cuyo checkbox está en true.
   */
  public getMonedasSeleccionadas(): string[] {
    const controlArray = this.formSeleccion.get('seleccion') as FormArray;
    const ids: string[] = [];
    controlArray.controls.forEach((ctrl, i) => {
      if (ctrl.value) {
        ids.push(this.todasMisMonedas[i]._id);
      }
    });
    return ids;
  }

  /**
   * Al hacer clic en “Añadir a la colección”.
   */
  public onSubmit(): void {
    const seleccionados = this.getMonedasSeleccionadas();
    if (seleccionados.length === 0) {
      return;
    }
    this.isLoading = true;
    this.coleccionService
      .agregarMonedasAColeccion(this.collectionId, seleccionados)
      .subscribe({
        next: () => {
          this.router.navigate(['/colecciones', this.collectionId]);
        },
        error: (err) => {
          console.error('Error añadiendo monedas a la colección', err);
          this.isLoading = false;
        },
      });
  }

  /**
   * “Cancelar” vuelve al detalle de la colección sin cambios.
   */
  public onCancelar(): void {
    this.router.navigate(['/colecciones', this.collectionId]);
  }
}
