import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Notification } from '@app/models/notificacion.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private baseUrl = environment.APIURL + 'notifications';

  constructor(private http: HttpClient) {}

  getNotifications(userId: string): Observable<Notification[]> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    const params = new HttpParams().set('userId', userId);
    return this.http.get<Notification[]>(this.baseUrl, {
      headers: headers || undefined,
      params,
    });
  }

  createNotification(notification: Notification): Observable<Notification> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    return this.http.post<Notification>(this.baseUrl, notification, {
      headers: headers || undefined,
    });
  }

  markAsRead(notificationId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;
    return this.http.patch(
      `${this.baseUrl}/${notificationId}`,
      { viewed: true },
      { headers: headers || undefined }
    );
  }
}
