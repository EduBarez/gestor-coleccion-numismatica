import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.userService.login(this.form.value).subscribe({
        next: (resp) => {
          const payload = jwtDecode<JwtPayload>(resp.token);
          localStorage.setItem('token', resp.token);
          localStorage.setItem('userId', payload.id);
          localStorage.setItem('userName', payload.nombre);
          localStorage.setItem('userRole', payload.rol);
          this.router.navigate(['/dashboard']);
        },
        error: (err) =>
          (this.error = err.error?.mensaje || 'Error en el login'),
      });
    }
  }
}
