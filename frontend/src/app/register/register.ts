import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      DNI: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.userService.register(this.form.value).subscribe({
        next: (user) =>
          (this.message = 'Registrado correctamente, pendiente de aprobación'),
        error: (err) =>
          (this.message = err.error?.mensaje || 'Error en el registro'),
      });
    }
  }
}
