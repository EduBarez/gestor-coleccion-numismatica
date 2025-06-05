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
import { ColeccionService } from '../services/coleccion.service';
import { ColeccionDetalleResponse } from '@app/models/coleccion.model';

@Injectable({ providedIn: 'root' })
export class PropietarioGuard implements CanActivate {
  constructor(
    private router: Router,
    private coleccionService: ColeccionService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(this.router.parseUrl('/login'));
    }

    const usuarioId = localStorage.getItem('userId') || '';
    if (!usuarioId) {
      return of(this.router.parseUrl('/login'));
    }

    const coleccionId = route.paramMap.get('id') || '';
    if (!coleccionId) {
      return of(this.router.parseUrl('/colecciones'));
    }

    return this.coleccionService.getColeccionById(coleccionId).pipe(
      map((respuesta: ColeccionDetalleResponse) => {
        if (respuesta.coleccion.user._id === usuarioId) {
          return true;
        } else {
          return this.router.parseUrl('/colecciones');
        }
      }),
      catchError(() => {
        return of(this.router.parseUrl('/colecciones'));
      })
    );
  }
}
