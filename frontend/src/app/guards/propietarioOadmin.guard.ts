// src/app/guards/owner-or-admin.guard.ts

import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { MonedaService } from '@app/services/monedas.service';

@Injectable({ providedIn: 'root' })
export class OwnerOrAdminGuard implements CanActivate {
  constructor(private router: Router, private monedaService: MonedaService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(this.router.parseUrl('/login'));
    }

    const rol = localStorage.getItem('userRole');
    if (rol === 'admin') {
      return of(true);
    }

    const monedaId = route.paramMap.get('id') || '';
    const usuarioId = localStorage.getItem('userId') || '';

    return this.monedaService.getMonedaById(monedaId).pipe(
      map((moneda) => {
        if (moneda.propietario === usuarioId) {
          return true;
        } else {
          return this.router.parseUrl('/monedas');
        }
      }),
      catchError(() => {
        return of(this.router.parseUrl('/monedas'));
      })
    );
  }
}
