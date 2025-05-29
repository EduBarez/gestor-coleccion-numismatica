import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MonedaService } from '../services/monedas.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MonedaUpdate } from '@app/models/moneda.models';

@Component({
  selector: 'app-crear-moneda',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './modificarmoneda.component.html',
  styleUrls: ['./modificarmoneda.component.scss'],
})
export class ModificarMonedaComponent {
  form!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  message = '';
  idMoneda: string = '';
  //fotoMoneda: File = new File([], '');

  constructor(
    private fb: FormBuilder,
    private monedaService: MonedaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      valor: ['', Validators.required],
      autoridad_emisora: ['', Validators.required],
      ceca: ['', Validators.required],
      datacion: ['', Validators.required],
      estado_conservacion: ['', Validators.required],
      metal: ['', Validators.required],
      peso: [null, [Validators.required, Validators.min(0.01)]],
      diametro: [null, [Validators.required, Validators.min(0.1)]],
      anverso: ['', Validators.required],
      reverso: ['', Validators.required],
      canto: [''],
      referencias: ['', Validators.required],
      observaciones: [''],
      fotografia: [null],
    });
  }

  ngOnInit(): void {
    this.idMoneda = this.route.snapshot.paramMap.get('id')!;
    this.monedaService.getMonedaById(this.idMoneda).subscribe({
      next: (moneda) => {
        this.form.patchValue({
          nombre: moneda.nombre,
          valor: moneda.valor,
          autoridad_emisora: moneda.autoridad_emisora,
          ceca: moneda.ceca,
          datacion: moneda.datacion,
          estado_conservacion: moneda.estado_conservacion,
          metal: moneda.metal,
          peso: moneda.peso,
          diametro: moneda.diametro,
          anverso: moneda.anverso,
          reverso: moneda.reverso,
          canto: moneda.canto,
          referencias: moneda.referencias,
          observaciones: moneda.observaciones,
          //fotoMoneda: moneda.fotografia,
        });
      },
      error: (err) => {
        this.message = 'Error al cargar la moneda';
        this.router.navigate(['/monedas']);
      },
    });
  }

  onFileChange(event: Event) {
    const inp = event.target as HTMLInputElement;
    if (inp.files && inp.files.length) {
      this.selectedFile = inp.files[0];
      this.form.patchValue({ fotografia: this.selectedFile });
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // 1) Crear FormData
    const fd = new FormData();

    // 2) Añadir todos los campos del formulario (menos 'fotografia')
    Object.entries(this.form.value).forEach(([key, val]) => {
      if (
        key !== 'fotografia' &&
        val !== null &&
        val !== undefined &&
        val !== ''
      ) {
        fd.append(key, String(val));
      }
    });

    // 3) Si hay fichero nuevo, añadirlo bajo el mismo name que usas en Multer
    if (this.selectedFile) {
      fd.append('fotografia', this.selectedFile);
    }

    // 4) Llamar al servicio pasando el FormData
    this.monedaService.updateMoneda(this.idMoneda, fd).subscribe({
      next: () => {
        this.message = 'Moneda modificada correctamente';
        this.router.navigate(['/monedas/' + this.idMoneda]);
      },
      error: (err) => {
        this.message = err.error?.error || 'Error al modificar moneda';
      },
    });
  }

  // submit(): void {
  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     return;
  //   }

  //   const {
  //     nombre,
  //     valor,
  //     autoridad_emisora,
  //     ceca,
  //     datacion,
  //     estado_conservacion,
  //     metal,
  //     peso,
  //     diametro,
  //     anverso,
  //     reverso,
  //     canto,
  //     referencias,
  //     observaciones,
  //     fotografia,
  //   } = this.form.value;

  //   const monedaData: MonedaUpdate = {
  //     nombre,
  //     valor,
  //     autoridad_emisora,
  //     ceca,
  //     datacion,
  //     estado_conservacion,
  //     metal,
  //     peso,
  //     diametro,
  //     anverso,
  //     reverso,
  //     canto,
  //     referencias,
  //     observaciones,
  //     fotografia,
  //   };

  //   if (this.selectedFile) {
  //     monedaData.fotografia = this.selectedFile;
  //   } else {
  //     monedaData.fotografia = this.fotoMoneda;
  //   }

  //   this.monedaService.updateMoneda(this.idMoneda, monedaData).subscribe({
  //     next: () => {
  //       this.message = 'Moneda modificar correctamente';
  //       this.router.navigate(['/monedas']);
  //     },
  //     error: (err) => {
  //       this.message = err.error?.error || 'Error al modificar moneda';
  //     },
  //   });
  // }

  cancel() {
    this.router.navigate(['/monedas/' + this.idMoneda]);
  }
}
