import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';

//Propio
import { TicketData } from '../interfaces/ticketdata.interface';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({ timestamps: true })
export class Ticket {
  _id: string;

  @Prop({ required: true, type: SchemaTypes.String, unique: true })
  serial_ticket: string;

  @Prop({ required: true, type: SchemaTypes.Mixed })
  ticketData: TicketData;

  @Prop({ default: false })
  entregado: boolean;

  @Prop({ default: 0, type: 'number' })
  intentos: number;

  @Prop({ required: true, type: SchemaTypes.String })
  contacto: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
