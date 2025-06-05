import { Moneda } from './moneda.models';
import { UsuarioResumen } from './user.model';

export interface Coleccion {
  _id: string;
  nombre: string;
  descripcion?: string;
  publica: boolean;
  user: UsuarioResumen;
  creadaEn?: string;
  monedas: Moneda[];
}

export interface ColeccionResponse {
  colecciones: Coleccion[];
  total: number;
  page: number;
  limit: number;
}

export interface ColeccionConMonedas {
  coleccion: Coleccion;
  monedas: any[];
}

export interface ColeccionResponse {
  colecciones: Coleccion[];
  total: number;
  page: number;
  limit: number;
}

export interface ColeccionDetalleResponse {
  coleccion: Coleccion;
}
