import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

//Propio
import { Ticket, TicketDocument } from './entity/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket.name) private ticketDocument: Model<TicketDocument>,
  ) {}

  private readonly logger = new Logger('TicketService');

  async create(createTicketDto: CreateTicketDto): Promise<Ticket | null> {
    try {
      const newTicket = new this.ticketDocument(createTicketDto);
      return await newTicket.save();
    } catch (e) {
      this.logger.error(`Error guardando Ticket ${e}`);
      return null;
    }
  }

  async findAll(entregado: boolean, intentos: number = 0): Promise<Ticket[]> {
    try {
      return await this.ticketDocument
        .find({ entregado, intentos: { $lt: intentos } })
        .exec();
    } catch (e) {
      this.logger.error(`Error findAll => ${e}`);
      return [];
    }
  }

  //? Devuelve flase si apsa un errro, o no hay boletos opendientes... y true si hay boletos pendientes
  async findBoletosPendientesByContacto(contacto: string): Promise<Ticket[]> {
    try {
      //Consultar # boletos pendiente por enviar
      const boletos = await this.ticketDocument.find({
        entregado: false,
        contacto: contacto,
      });

      //Actualizo la propiedad de intentos a 0 para que se puedan enviar
      await this.ticketDocument.updateMany(
        {
          entregado: false,
          contacto: contacto,
        },
        { $set: { intentos: 0 } },
      );

      return boletos;
    } catch (e) {
      this.logger.error(`Error en findBoletosPendientesByContacto ${e}`);
      return [];
    }
  }

  async changeEntregado(
    id_mongo: string,
    entregado: boolean,
  ): Promise<boolean> {
    try {
      await this.ticketDocument
        .updateOne({ _id: id_mongo }, { $set: { entregado: entregado } })
        .exec();
      return true;
    } catch (e) {
      this.logger.error(`Error actualizando el Ticket ${e}`);
      return false;
    }
  }

  async SumarIntentos(id_mongo: string): Promise<boolean> {
    try {
      await this.ticketDocument
        .updateOne({ _id: id_mongo }, { $inc: { intentos: 1 } })
        .exec();
      return true;
    } catch (e) {
      this.logger.error(`Error actualizando el Ticket ${e}`);
      return false;
    }
  }
}
