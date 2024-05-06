export interface ApiResultados {
  nombre_sorteo: string;
  nombre_api: string;
}

export interface ResponseResultadosApi {
  nombre_sorteo: string;
  fecha: string;
  numeros_ganadores: string[];
}
