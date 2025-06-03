import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trivia } from '@app/models/trivia.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TriviaService {
  private baseUrl = environment.APIURL + 'trivia';

  constructor(private http: HttpClient) {}

  getPreguntas(): Observable<Trivia[]> {
    return this.http.get<Trivia[]>(`${this.baseUrl}`);
  }

  getPreguntaById(id: string): Observable<Trivia> {
    return this.http.get<Trivia>(`${this.baseUrl}/${id}`);
  }

  getPreguntasPorPeriodo(nombrePeriodo: string): Observable<Trivia[]> {
    return this.http.get<Trivia[]>(`${this.baseUrl}/periodo/${nombrePeriodo}`);
  }

  createPregunta(preguntaPayload: Omit<Trivia, '_id'>): Observable<Trivia> {
    return this.http.post<Trivia>(`${this.baseUrl}`, preguntaPayload);
  }

  updatePregunta(
    id: string,
    updatePayload: Partial<Omit<Trivia, '_id'>>
  ): Observable<Trivia> {
    return this.http.put<Trivia>(`${this.baseUrl}/${id}`, updatePayload);
  }

  deletePregunta(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
