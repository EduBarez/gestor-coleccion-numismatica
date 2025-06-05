import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@app/services/notification.service';
import { Notification } from '@app/models/notificacion.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.scss'],
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  userId: string = '';

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';
    this.loadNotifications();
  }

  /** Carga las notificaciones del usuario */
  loadNotifications(): void {
    if (!this.userId) return;

    this.notificationService
      .getNotifications(this.userId)
      .subscribe((notifs) => {
        this.notifications = notifs;
      });
  }

  /** Determina si existe al menos una notificación no leída */
  hasUnread(): boolean {
    return this.notifications.some((n) => !n.viewed);
  }

  /** Marca una notificación específica como leída al hacer hover */
  markAsRead(notification: Notification): void {
    if (notification.viewed) return;
    this.notificationService.markAsRead(notification._id!).subscribe(() => {
      notification.viewed = true;
    });
  }
}
