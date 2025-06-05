// //coleccion.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, map } from 'rxjs';
// import { environment } from '../../environments/environment';
// import {
//   Coleccion,
//   ColeccionConMonedas,
//   ColeccionResponse,
// } from '@app/models/coleccion.model';

// export interface FiltrosColecciones {
//   search?: string;
// }

// @Injectable({ providedIn: 'root' })
// export class ColeccionService {
//   private baseUrl = environment.APIURL + 'colecciones';

//   constructor(private http: HttpClient) {}

//   /** 1. Lista de colecciones públicas */
//   getPublicas(): Observable<Coleccion[]> {
//     return this.http.get<Coleccion[]>(`${this.baseUrl}/publicas`);
//   }

//   /** 2. Mis colecciones (requiere auth) */
//   // getMisColecciones(): Observable<Coleccion[]> {
//   //   const token = localStorage.getItem('token');
//   //   const headers = token
//   //     ? new HttpHeaders({ Authorization: `Bearer ${token}` })
//   //     : undefined;
//   //   return this.http.get<Coleccion[]>(
//   //     `${this.baseUrl}/usuario`,
//   //     headers ? { headers } : {}
//   //   );
//   // }
//   getMisColecciones(): Observable<ColeccionResponse> {
//     const token = localStorage.getItem('token') || '';
//     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
//     return this.http.get<ColeccionResponse>(`${this.baseUrl}/usuario`, {
//       headers,
//     });
//   }

//   /** 3. Todas las colecciones (sólo admin) */
//   getTodasLasColecciones(): Observable<Coleccion[]> {
//     const token = localStorage.getItem('token');
//     const headers = token
//       ? new HttpHeaders({ Authorization: `Bearer ${token}` })
//       : undefined;
//     return this.http.get<Coleccion[]>(
//       `${this.baseUrl}/admin/todas`,
//       headers ? { headers } : {}
//     );
//   }

//   /** 4. Obtener una colección con sus monedas */
//   // getColeccionById(
//   //   id: string
//   // ): Observable<{ coleccion: Coleccion; monedas: any[] }> {
//   //   return this.http.get<{ coleccion: Coleccion; monedas: any[] }>(
//   //     `${this.baseUrl}/${id}`
//   //   );
//   // }
//   getColeccionById(id: string): Observable<ColeccionConMonedas> {
//     const token = localStorage.getItem('token');
//     const headers = token
//       ? new HttpHeaders({ Authorization: `Bearer ${token}` })
//       : undefined;

//     return this.http.get<ColeccionConMonedas>(
//       `${this.baseUrl}/${id}`,
//       headers ? { headers } : {}
//     );
//   }

//   /** 5. Crear nueva colección */
//   createColeccion(data: {
//     nombre: string;
//     descripcion?: string;
//     publica: boolean;
//   }): Observable<Coleccion> {
//     const token = localStorage.getItem('token');
//     const headers = token
//       ? new HttpHeaders({ Authorization: `Bearer ${token}` })
//       : undefined;
//     return this.http.post<Coleccion>(
//       `${this.baseUrl}`,
//       data,
//       headers ? { headers } : {}
//     );
//   }

//   /** 6. Actualizar colección */
//   updateColeccion(
//     id: string,
//     data: { nombre?: string; descripcion?: string; publica?: boolean }
//   ): Observable<Coleccion> {
//     const token = localStorage.getItem('token');
//     const headers = token
//       ? new HttpHeaders({ Authorization: `Bearer ${token}` })
//       : undefined;
//     return this.http.put<Coleccion>(
//       `${this.baseUrl}/${id}`,
//       data,
//       headers ? { headers } : {}
//     );
//   }

//   /** 7. Eliminar colección */
//   deleteColeccion(id: string): Observable<{ message: string }> {
//     const token = localStorage.getItem('token');
//     const headers = token
//       ? new HttpHeaders({ Authorization: `Bearer ${token}` })
//       : undefined;
//     return this.http.delete<{ message: string }>(
//       `${this.baseUrl}/${id}`,
//       headers ? { headers } : {}
//     );
//   }

//   /** 8. Agregar monedas a colección */
//   agregarMonedasAColeccion(
//     id: string,
//     monedas: string[]
//   ): Observable<{ message: string }> {
//     const token = localStorage.getItem('token');
//     const headers = token
//       ? new HttpHeaders({ Authorization: `Bearer ${token}` })
//       : undefined;
//     return this.http.put<{ message: string }>(
//       `${this.baseUrl}/${id}/agregar-monedas`,
//       { monedas },
//       headers ? { headers } : {}
//     );
//   }

//   /** 9. Quitar monedas de colección */
//   // quitarMonedasDeColeccion(
//   //   id: string,
//   //   monedas: string[]
//   // ): Observable<{ message: string }> {
//   //   const token = localStorage.getItem('token');
//   //   const headers = token
//   //     ? new HttpHeaders({ Authorization: `Bearer ${token}` })
//   //     : undefined;
//   //   return this.http.put<{ message: string }>(
//   //     `${this.baseUrl}/${id}/quitar-monedas`,
//   //     { monedas },
//   //     headers ? { headers } : {}
//   //   );
//   // }

//   /** 9. Quitar monedas de colección */
//   quitarMonedasDeColeccion(
//     id: string,
//     monedas: string[]
//   ): Observable<{ message: string }> {
//     const token = localStorage.getItem('token');
//     const headers = token
//       ? new HttpHeaders({ Authorization: `Bearer ${token}` })
//       : undefined;

//     return this.http.put<{ message: string }>(
//       `${this.baseUrl}/${id}/quitar-monedas`,
//       { monedas },
//       headers ? { headers } : {}
//     );
//   }
// }

// src/app/services/coleccion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Coleccion,
  ColeccionResponse,
  ColeccionDetalleResponse, // <-- nuevo alias
} from '@app/models/coleccion.model';

export interface FiltrosColecciones {
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class ColeccionService {
  private baseUrl = environment.APIURL + 'colecciones';

  constructor(private http: HttpClient) {}

  /** 1. Lista de colecciones públicas */
  getPublicas(): Observable<Coleccion[]> {
    return this.http.get<Coleccion[]>(`${this.baseUrl}/publicas`);
  }

  /** 2. Mis colecciones (requiere auth) */
  getMisColecciones(): Observable<Coleccion[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Coleccion[]>(
      `${this.baseUrl}/usuario/mis-colecciones`,
      { headers }
    );
  }

  /** 3. Todas las colecciones (sólo admin) */
  getTodasLasColecciones(): Observable<Coleccion[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Coleccion[]>(`${this.baseUrl}/admin/todas`, {
      headers,
    });
  }

  /** 4. Obtener una colección con sus monedas */
  getColeccionById(id: string): Observable<ColeccionDetalleResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<ColeccionDetalleResponse>(`${this.baseUrl}/${id}`, {
      headers,
    });
  }

  /** 5. Crear nueva colección */
  createColeccion(data: {
    nombre: string;
    descripcion?: string;
    publica: boolean;
  }): Observable<Coleccion> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<Coleccion>(`${this.baseUrl}`, data, { headers });
  }

  /** 6. Actualizar colección */
  updateColeccion(
    id: string,
    data: { nombre?: string; descripcion?: string; publica?: boolean }
  ): Observable<Coleccion> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<Coleccion>(`${this.baseUrl}/${id}`, data, {
      headers,
    });
  }

  /** 7. Eliminar colección */
  deleteColeccion(id: string): Observable<{ message: string }> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`, {
      headers,
    });
  }

  /** 8. Agregar monedas a colección */
  agregarMonedasAColeccion(
    id: string,
    monedas: string[]
  ): Observable<{ message: string }> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<{ message: string }>(
      `${this.baseUrl}/${id}/agregar-monedas`,
      { monedas },
      { headers }
    );
  }

  /** 9. Quitar monedas de colección */
  quitarMonedasDeColeccion(
    id: string,
    monedas: string[]
  ): Observable<{ message: string }> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put<{ message: string }>(
      `${this.baseUrl}/${id}/quitar-monedas`,
      { monedas },
      { headers }
    );
  }
}
