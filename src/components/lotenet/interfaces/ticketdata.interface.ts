// Define la interfaz para el formato de los datos que deseas guardar
export interface Jugada {
  numero: string;
  monto: number;
  prefijo: string;
  alias: string;
}

export interface TicketData {
  id: number;
  fecha_caduca: string;
  serialkey: string;
  created_at: string;
  monto_jugado: number;
  contacto: string;
  sorteo_numero?: number;
  sorteo_nombre?: string;
  terminal_codigo?: string;
  loteria_nombre?: string;
  consorcio_nombre?: string;
  consorcio_pie?: string; // Puedes cambiar any por el tipo correcto si lo conoces
  jugadas: Jugada[];
}
