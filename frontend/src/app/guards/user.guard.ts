import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class UserGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const token = localStorage.getItem('token');
    if (!token) {
      return this.router.parseUrl('/login');
    }

    const rol = localStorage.getItem('userRole');
    if (rol !== 'user') {
      return this.router.parseUrl('/');
    }

    return true;
  }
}
