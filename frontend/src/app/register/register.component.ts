import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    NgIf,
    MatRadioModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatCardModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  form: FormGroup;
  message = '';
  error = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]+$'),
        ],
      ],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      DNI: ['', Validators.required],
      rol: ['user', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.userService.register(this.form.value).subscribe({
        next: (user) => {
          this.message = 'Registrado correctamente, pendiente de aprobación';
          this.loading = false;
          this.router.navigate(['/']);
        },
        //        error: (err) => (this.error = err.error.error),
        error: (err) => {
          this.error = err.error.error;
          this.loading = false;
        },
      });
    }
  }
}
