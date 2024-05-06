export interface Boleto {
  serialkey: string;
  fecha_ticket: string;
  monto_jugado: number;
  sorteo_nombre: string;
  sorteo_numero: number;
}

export interface ResponseBoletos {
  codigo: string;
  datos: Boleto[];
  msg: string;
  transaccion: null;
}

export interface PinPago {
  pin_pago: string;
  pin_expiracion: string;
}

export interface ResponsePinPago {
  codigo: string;
  datos: PinPago;
  msg: string;
  transaccion: null;
}

export interface ResponseApiPremios {
  resp: number;
  numeros: string[];
}
