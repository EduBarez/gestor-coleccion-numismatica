import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ranking } from '@app/models/ranking.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RankingService {
  private baseUrl = environment.APIURL + 'ranking';

  constructor(private http: HttpClient) {}

  addRanking(
    ranking: Omit<Ranking, '_id' | 'idUsuario' | 'fecha'>
  ): Observable<Ranking> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    return this.http.post<Ranking>(
      `${this.baseUrl}`,
      ranking,
      headers ? { headers } : {}
    );
  }

  getTopRanking(limit: number = 10, periodo?: string): Observable<Ranking[]> {
    let url = `${this.baseUrl}/top?limit=${limit}`;
    if (periodo) {
      url += `&periodo=${encodeURIComponent(periodo)}`;
    }
    return this.http.get<Ranking[]>(url);
  }
}
