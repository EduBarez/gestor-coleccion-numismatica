import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, RegisterData, LoginData, LoginResponse } from '../models/user.model';
import { environment } from '../../environments/environment';



@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = environment.APIURL + 'usuarios';

  constructor(private http: HttpClient) {}

  register(data: RegisterData): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, data);
  }

  login(data: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data);
  }

  getPending(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/pending`);
  }

  approve(id: number): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/approve/${id}`, {});
  }

  reject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reject/${id}`);
  }
}



// import { Component, OnInit } from '@angular/core';
// import { UserService } from '../../services/user.service';
// import { User } from '../../models';

// @Component({
//   selector: 'app-user-management',
//   templateUrl: './user-management.component.html',
//   styleUrls: ['./user-management.component.css']
// })
// export class UserManagementComponent implements OnInit {
//   pendientes: User[] = [];
//   error = '';

//   constructor(private userService: UserService) {}

//   ngOnInit(): void {
//     this.loadPendings();
//   }

//   loadPendings(): void {
//     this.userService.getPending().subscribe({
//       next: list => this.pendientes = list,
//       error: () => this.error = 'No se pudieron cargar usuarios pendientes'
//     });
//   }

//   approve(id: string): void {
//     this.userService.approve(id).subscribe({
//       next: () => this.loadPendings(),
//       error: () => this.error = 'Error al aprobar usuario'
//     });
//   }

//   reject(id: string): void {
//     this.userService.reject(id).subscribe({
//       next: () => this.loadPendings(),
//       error: () => this.error = 'Error al rechazar usuario'
//     });
//   }
// }
