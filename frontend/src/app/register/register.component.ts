import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  form: FormGroup;
  message = '';

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
      this.userService.register(this.form.value).subscribe({
        next: (user) => {
          this.message = 'Registrado correctamente, pendiente de aprobación';
          this.router.navigate(['/']);
        },
        error: (err) => (this.message = err.error.error),
      });
    }
  }
}
