import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  MonedaResponse,
  FiltrosMonedas,
  Moneda,
  MonedaCreate,
  MonedaUpdate,
} from '../models/moneda.models';

@Injectable({ providedIn: 'root' })
export class MonedaService {
  private baseUrl = environment.APIURL + 'monedas';

  constructor(private http: HttpClient) {}

  getMonedas(
    page: number,
    limit: number,
    filtros: FiltrosMonedas
  ): Observable<MonedaResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        const paramName = key === 'search' ? 'nombre' : key;
        params = params.set(paramName, value);
      }
    });

    return this.http.get<MonedaResponse>(this.baseUrl, { params });
  }

  getMonedaById(id: string): Observable<Moneda> {
    return this.http.get<Moneda>(`${this.baseUrl}/${id}`);
  }

  createMoneda(formData: FormData): Observable<Moneda> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    return this.http.post<Moneda>(
      this.baseUrl,
      formData,
      headers ? { headers } : {}
    );
  }

  updateMoneda(id: string, formData: FormData): Observable<Moneda> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    return this.http.put<Moneda>(
      `${this.baseUrl}/${id}`,
      formData,
      headers ? { headers } : {}
    );
  }

  deleteMoneda(id: string): Observable<{ message: string }> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;

    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${id}`,
      headers ? { headers } : {}
    );
  }

  getMisMonedas(): Observable<Moneda[]> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;

    return this.http.get<Moneda[]>(
      `${this.baseUrl}/usuario/mis-monedas`,
      headers ? { headers } : {}
    );
  }

  getMonedasDeUsuario(userId: string): Observable<Moneda[]> {
    return this.http.get<Moneda[]>(`${this.baseUrl}/usuario/${userId}`);
  }
}
