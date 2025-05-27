// src/app/services/moneda.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  MonedaResponse,
  FiltrosMonedas,
  Moneda,
  MonedaCreate,
} from '../models/moneda.models';

@Injectable({ providedIn: 'root' })
export class MonedaService {
  private baseUrl = environment.APIURL + 'monedas';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista paginada de monedas con filtros opcionales.
   * @param page número de página (1-based)
   * @param limit elementos por página
   * @param filtros campos definidos en FiltrosMonedas (search → nombre)
   */
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

  /** Obtiene una moneda por su ID */
  getMonedaById(id: string): Observable<Moneda> {
    return this.http.get<Moneda>(`${this.baseUrl}/${id}`);
  }

  /** Crea una nueva moneda (con multipart/form-data para la foto) */
  createMoneda(formData: MonedaCreate): Observable<Moneda> {
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

  /** Actualiza una moneda por ID */
  updateMoneda(id: string, formData: FormData): Observable<Moneda> {
    return this.http.put<Moneda>(`${this.baseUrl}/${id}`, formData);
  }

  /** Elimina una moneda por ID */
  deleteMoneda(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  /** Opcional: obtiene las monedas del usuario autenticado */
  getMisMonedas(): Observable<Moneda[]> {
    return this.http.get<Moneda[]>(`${this.baseUrl}/usuario/mis-monedas`);
  }

  /** Opcional: obtiene las monedas de un usuario dado (perfil público) */
  getMonedasDeUsuario(userId: string): Observable<Moneda[]> {
    return this.http.get<Moneda[]>(`${this.baseUrl}/usuario/${userId}`);
  }
}
