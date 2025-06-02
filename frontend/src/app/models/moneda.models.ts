export interface Moneda {
  _id: string;
  fotografia: string;
  nombre: string;
  valor: string;
  autoridad_emisora: string;
  ceca: string;
  datacion: string;
  estado_conservacion: string;
  metal: string;
  peso: number;
  diametro: number;
  anverso: string;
  reverso: string;
  canto: string;
  referencias: string;
  observaciones: string;
  propietario: string;
  coleccion: string | null;
}

export interface MonedaCreate {
  nombre: string;
  valor: string;
  autoridad_emisora: string;
  ceca: string;
  datacion: string;
  estado_conservacion: string;
  metal: string;
  peso: number;
  diametro: number;
  anverso: string;
  reverso: string;
  canto?: string;
  referencias: string;
  observaciones: string;
  fotografia: File;
}

export interface MonedaUpdate {
  nombre: string;
  valor: string;
  autoridad_emisora: string;
  ceca: string;
  datacion: string;
  estado_conservacion: string;
  metal: string;
  peso: number;
  diametro: number;
  anverso: string;
  reverso: string;
  canto?: string;
  referencias: string;
  observaciones: string;
  fotografia?: File;
}

export interface FiltrosMonedas {
  search: string;
  autoridad_emisora: string;
  ceca: string;
  datacion: string;
  estado_conservacion: string;
  metal: string;
}

export interface MonedaResponse {
  monedas: Moneda[];
  total: number;
  page: number;
  limit: number;
}

export const filtrosVacios: FiltrosMonedas = {
  search: '',
  autoridad_emisora: '',
  ceca: '',
  datacion: '',
  estado_conservacion: '',
  metal: '',
};
