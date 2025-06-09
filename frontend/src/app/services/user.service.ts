import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  User,
  RegisterData,
  LoginData,
  LoginResponse,
} from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = environment.APIURL + 'usuarios';

  constructor(private http: HttpClient) {}

  register(data: RegisterData): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/register`,
      data
    );
  }

  login(data: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data);
  }

  getPending(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/pending`);
  }

  approve(id: string): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/approve/${id}`, {});
  }

  reject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reject/${id}`);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user/${id}`);
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  public isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin';
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  public isPropietario(propietario: string): boolean {
    return localStorage.getItem('userId') === propietario;
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/all`);
  }

  deleteUserCascade(id: string): Observable<{ message: string }> {
    const token = localStorage.getItem('token') || '';
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/cascade/${id}`,
      headers
    );
  }
}
