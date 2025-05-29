export interface Coleccion {
  _id: string;
  nombre: string;
  descripcion?: string;
  publica: boolean;
  user: UsuarioResumen;
  creadaEn?: string;
}

export interface ColeccionResponse {
  colecciones: Coleccion[];
  total: number;
  page: number;
  limit: number;
}

export interface UsuarioResumen {
  _id: string;
  nombre?: string;
  username?: string;
}
