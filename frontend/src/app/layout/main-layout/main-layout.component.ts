import { Component, Renderer2, ViewChild } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '@app/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationService } from '@app/services/notification.service';
import { Notification } from '@app/models/notificacion.model';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationComponent } from '@app/notificacion/notificacion.component';
import { filter, fromEvent, interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterModule,
    NgIf,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    NotificationComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  currentYear = new Date().getFullYear();
  userName = localStorage.getItem('userName') || '';
  userRol = localStorage.getItem('userRole') || '';

  notifications: Notification[] = [];
  hasUnread: boolean = false;
  private routerSub!: Subscription;
  private pollingSub!: Subscription;
  private visibilitySub!: Subscription;

  @ViewChild(NotificationComponent)
  private notificationChild!: NotificationComponent;

  constructor(
    private router: Router,
    public userService: UserService,
    private notificationService: NotificationService,
    private renderer: Renderer2
  ) {
    if (this.userRol === 'user') this.userRol = 'usuario';
  }

  ngOnInit(): void {
    if (this.userService.isLoggedIn()) {
      this.loadNotifications();

      this.routerSub = this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe(() => {
          this.loadNotifications();
        });

      this.pollingSub = interval(10000).subscribe(() => {
        this.loadNotifications();
      });

      this.visibilitySub = fromEvent(document, 'visibilitychange').subscribe(
        () => {
          if (!document.hidden) {
            this.loadNotifications();
          }
        }
      );
    }
  }

  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
    if (this.pollingSub) this.pollingSub.unsubscribe();
    if (this.visibilitySub) this.visibilitySub.unsubscribe();
  }

  private loadNotifications(): void {
    const userId = localStorage.getItem('userId') || '';
    if (!userId) return;

    this.notificationService.getNotifications(userId).subscribe((notifs) => {
      this.notifications = notifs;
      this.hasUnread = this.notifications.some((n) => !n.viewed);
    });
  }

  onNotifMenuOpened(): void {
    if (this.notificationChild) {
      this.notificationChild.loadNotifications();
    }

    const userId = localStorage.getItem('userId') || '';
    if (!userId) return;

    this.notificationService.getNotifications(userId).subscribe((notifs) => {
      this.notifications = notifs;
      this.hasUnread = this.notifications.some((n) => !n.viewed);
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    this.router.navigate(['/']);
  }
}
