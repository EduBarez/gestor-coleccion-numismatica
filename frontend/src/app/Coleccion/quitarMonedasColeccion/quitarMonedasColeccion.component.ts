// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { MatListModule } from '@angular/material/list';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { ColeccionService } from '@app/services/coleccion.service';
// import {
//   FormBuilder,
//   FormGroup,
//   FormArray,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import { ColeccionConMonedas } from '@app/models/coleccion.model';

// @Component({
//   selector: 'app-quitar-monedas',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     ReactiveFormsModule,
//     MatListModule,
//     MatCheckboxModule,
//     MatButtonModule,
//     MatCardModule,
//     MatProgressSpinnerModule,
//   ],
//   templateUrl: './quitarMonedasColeccion.component.html',
//   styleUrls: ['./quitarMonedasColeccion.component.scss'],
// })
// export class QuitarMonedasColeccionComponent implements OnInit {
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);
//   private coleccionService = inject(ColeccionService);
//   private fb = inject(FormBuilder);

//   public isLoading: boolean = false;
//   public collectionId!: string;
//   public monedasEnColeccion: any[] = [];
//   public formSeleccion: FormGroup;

//   constructor() {
//     this.formSeleccion = this.fb.group({
//       seleccion: this.fb.array([]),
//     });
//   }

//   ngOnInit(): void {
//     this.route.paramMap.subscribe((params) => {
//       const id = params.get('id');
//       if (!id) {
//         this.router.navigate(['/colecciones']);
//         return;
//       }
//       this.collectionId = id;
//       this.cargarMonedasEnColeccion();
//     });
//   }

//   private cargarMonedasEnColeccion(): void {
//     this.isLoading = true;

//     this.coleccionService.getColeccionById(this.collectionId).subscribe({
//       next: (coleccion: ColeccionConMonedas) => {
//         this.monedasEnColeccion = Array.isArray(coleccion.monedas)
//           ? coleccion.monedas
//           : [];
//         this.inicializarFormArray();
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Error al cargar monedas de la colección', err);
//         this.isLoading = false;
//       },
//     });
//   }

//   private inicializarFormArray(): void {
//     const controlArray = this.formSeleccion.get('seleccion') as FormArray;
//     // Limpiar controles previos (si hubiera)
//     while (controlArray.length !== 0) {
//       controlArray.removeAt(0);
//     }
//     // Agregar un control (false) por cada moneda
//     this.monedasEnColeccion.forEach(() =>
//       controlArray.push(this.fb.control(false))
//     );
//   }

//   /** Devuelve true si no hay ningún checkbox marcado */
//   public get ningunCheckboxSeleccionado(): boolean {
//     const controlArray = this.formSeleccion.get('seleccion') as FormArray;
//     return controlArray.controls.every((ctrl) => !ctrl.value);
//   }

//   /** Construye el array de IDs de las monedas seleccionadas para quitar */
//   public getMonedasSeleccionadas(): string[] {
//     const controlArray = this.formSeleccion.get('seleccion') as FormArray;
//     const ids: string[] = [];
//     controlArray.controls.forEach((ctrl, i) => {
//       if (ctrl.value) {
//         ids.push(this.monedasEnColeccion[i]._id);
//       }
//     });
//     return ids;
//   }

//   /** Al hacer clic en "Quitar de la colección" */
//   public onSubmit(): void {
//     const seleccionados = this.getMonedasSeleccionadas();
//     if (seleccionados.length === 0) {
//       return;
//     }
//     this.isLoading = true;
//     this.coleccionService
//       .quitarMonedasDeColeccion(this.collectionId, seleccionados)
//       .subscribe({
//         next: () => {
//           // Al quitar con éxito, volvemos al detalle de la colección
//           this.router.navigate(['/colecciones', this.collectionId]);
//         },
//         error: (err) => {
//           console.error('Error quitando monedas de la colección', err);
//           this.isLoading = false;
//         },
//       });
//   }

//   /** Cancela y vuelve al detalle de la colección sin cambios */
//   public onCancelar(): void {
//     this.router.navigate(['/colecciones', this.collectionId]);
//   }
// }

// src/app/quitarMonedasColeccion/quitarMonedasColeccion.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ColeccionService } from '@app/services/coleccion.service';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-quitar-monedas',
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
  templateUrl: './quitarMonedasColeccion.component.html',
  styleUrls: ['./quitarMonedasColeccion.component.scss'],
})
export class QuitarMonedasColeccionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private coleccionService = inject(ColeccionService);
  private fb = inject(FormBuilder);

  public isLoading = false;
  public collectionId!: string;
  public monedasEnColeccion: any[] = [];
  public formSeleccion: FormGroup;

  constructor() {
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
      this.cargarMonedasEnColeccion();
    });
  }

  private cargarMonedasEnColeccion(): void {
    this.isLoading = true;

    this.coleccionService.getColeccionById(this.collectionId).subscribe({
      next: (res) => {
        // Antes usábamos res.monedas, ahora es res.coleccion.monedas
        this.monedasEnColeccion = Array.isArray(res.coleccion.monedas)
          ? res.coleccion.monedas
          : [];
        this.inicializarFormArray();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar monedas de la colección', err);
        this.isLoading = false;
      },
    });
  }

  private inicializarFormArray(): void {
    const controlArray = this.formSeleccion.get('seleccion') as FormArray;
    while (controlArray.length !== 0) {
      controlArray.removeAt(0);
    }
    this.monedasEnColeccion.forEach(() =>
      controlArray.push(this.fb.control(false))
    );
  }

  public get ningunCheckboxSeleccionado(): boolean {
    const controlArray = this.formSeleccion.get('seleccion') as FormArray;
    return controlArray.controls.every((ctrl) => !ctrl.value);
  }

  public getMonedasSeleccionadas(): string[] {
    const controlArray = this.formSeleccion.get('seleccion') as FormArray;
    const ids: string[] = [];
    controlArray.controls.forEach((ctrl, i) => {
      if (ctrl.value) {
        ids.push(this.monedasEnColeccion[i]._id);
      }
    });
    return ids;
  }

  public onSubmit(): void {
    const seleccionados = this.getMonedasSeleccionadas();
    if (seleccionados.length === 0) {
      return;
    }
    this.isLoading = true;
    this.coleccionService
      .quitarMonedasDeColeccion(this.collectionId, seleccionados)
      .subscribe({
        next: () => {
          this.router.navigate(['/colecciones', this.collectionId]);
        },
        error: (err) => {
          console.error('Error quitando monedas de la colección', err);
          this.isLoading = false;
        },
      });
  }

  public onCancelar(): void {
    this.router.navigate(['/colecciones', this.collectionId]);
  }
}
