import { TicketData } from '../interfaces/ticketdata.interface';

export class CreateTicketDto {
  ticketData: TicketData;
  entregado: boolean;
  serial_ticket: string;
  contacto: string;
}
