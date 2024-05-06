import { TicketData } from 'src/components/lotenet/interfaces/ticketdata.interface';

export const ticket_data_mock: TicketData = {
  id: 2036813,
  fecha_caduca: '2024-05-26',
  serialkey: 'A_315AEKD37MG',
  created_at: '2024-04-26T09:51:37.859-04:00',
  monto_jugado: 100,
  contacto: '18298025258',
  sorteo_numero: 113751,
  sorteo_nombre: 'FLAM',
  terminal_codigo: '980009',
  loteria_nombre: 'FLORIDA',
  consorcio_nombre: 'PRUEBAS DEV',
  consorcio_pie: 'prueba Ticket',
  jugadas: [
    {
      numero: '01',
      monto: 100.0,
      prefijo: 'QN',
      alias: 'FL',
    },
    {
      numero: '01 02',
      monto: 100000.0,
      prefijo: 'QN',
      alias: 'FL',
    },
    {
      numero: '01 02 03',
      monto: 100.0,
      prefijo: 'QN',
      alias: 'FL',
    },
    {
      numero: '123',
      monto: 10000.0,
      prefijo: 'QN',
      alias: 'FL',
    },
    {
      numero: '06 08 17 85 96',
      monto: 1000.0,
      prefijo: 'QN',
      alias: 'FL',
    },
    {
      numero: '06 08 17 85 96 87 86',
      monto: 100.0,
      prefijo: 'QN',
      alias: 'FL',
    },
    {
      numero: '0674',
      monto: 100.0,
      prefijo: 'QN',
      alias: 'FL',
    },
  ],
};
