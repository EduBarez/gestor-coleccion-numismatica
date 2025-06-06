export interface Ranking {
  _id?: string;
  idUsuario: string;
  puntuacion: number;
  aciertos: number;
  totalPreguntas: number;
  tiempoSegundos: number;
  periodo: string | null;
  fecha: Date;
}
