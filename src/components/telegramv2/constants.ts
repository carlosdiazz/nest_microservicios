import { ApiResultados } from './interface/api-reusltados.interface';

export const ACCION = {
  comenzo_registro: 'comenzo_registro',
  nombre_preguntar: 'preguntar_nombre',
  nombre_guardado: 'nombre_guardado',
  cedula_preguntar: 'cedula_preguntar',
  cedula_guardada: 'cedula_guardada',
  numero_preguntar: 'numero_preguntar',
  numero_gurdado: 'numero_gurdado',
  registro_finalizado: 'registro_finalizado',
};

export const DATA_BUTTON = {
  boletos_pendientes: 'boletos_pendientes',
  boletos_vigentes: 'boletos_vigentes',
  boletos_ganadores: 'boletos_ganadores',
  boletos_pagados: 'boletos_pagados',
  code_ganador: 'code_ganador',
  ultimos_resultados: 'ultimos_resultados',
  resultados_api: 'resultados_api',
};

export const ApiPremios: ApiResultados[] = [
  { nombre_sorteo: 'Primera MD', nombre_api: 'primera_md' },
  { nombre_sorteo: 'Primera PM', nombre_api: 'primera_pm' },
  { nombre_sorteo: 'Real', nombre_api: 'real' },
  { nombre_sorteo: 'Ganamas', nombre_api: 'ganamas' },
  { nombre_sorteo: 'Lotedom', nombre_api: 'lotedom' },
  { nombre_sorteo: 'Leidsa', nombre_api: 'leidsa' },
  { nombre_sorteo: 'Loteka', nombre_api: 'loteka' },
  { nombre_sorteo: 'La Suerte MD', nombre_api: 'la_suerte_md' },
  { nombre_sorteo: 'La Suerte PM', nombre_api: 'la_suerte_pm' },
];
