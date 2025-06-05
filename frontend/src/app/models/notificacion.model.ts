export interface Notification {
  _id?: string;
  userId: string; // ID del usuario al que va dirigida la notificación
  message: string; // Texto de la notificación
  date: string; // Fecha y hora en formato ISO
  viewed: boolean; // Indicador de si ya ha sido leída
}
