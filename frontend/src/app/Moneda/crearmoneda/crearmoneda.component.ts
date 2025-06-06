import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MonedaService } from '../../services/monedas.service';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MonedaCreate } from '@app/models/moneda.models';

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
  templateUrl: './crearmoneda.component.html',
  styleUrls: ['./crearmoneda.component.scss'],
})
export class CrearMonedaComponent {
  form!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  message = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private monedaService: MonedaService,
    private router: Router
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
      fotografia: [null, Validators.required],
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

  cancel() {
    this.router.navigate(['/monedas']);
  }

  submit(): void {
    if (this.form.invalid || !this.selectedFile || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;

    const datos: MonedaCreate = this.form.value;
    const fd = new FormData();
    Object.entries(datos).forEach(([key, val]) => {
      fd.append(key, String(val));
    });
    fd.append('fotografia', this.selectedFile);

    this.monedaService.createMoneda(fd).subscribe({
      next: () => {
        this.message = 'Moneda creada correctamente';
        this.router.navigate(['/monedas']);
        this.isSubmitting = false;
      },
      error: (err) => {
        this.message = err.error?.error || 'Error al crear moneda';
        this.isSubmitting = false;
      },
    });
  }
}
