import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cron from 'node-cron';
import * as moment from 'moment';

//Propio
import { LotenetService } from './lotenet.service';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketData } from './interfaces/ticketdata.interface';
import { TicketPdfService } from './ticket_pdf.service';
import { Ticket } from './entity/ticket.entity';
import { Telegramv2Service, UsersService } from '../components';

@Injectable()
export class TicketInitService implements OnModuleInit {
  constructor(
    private readonly telegramv2Service: Telegramv2Service,
    private readonly lotenetService: LotenetService,
    private readonly ticketService: TicketService,
    private readonly ticketPdfService: TicketPdfService,
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger('TicketInitService');

  getCronEnviarTicket(): boolean {
    return this.configService.get<boolean>('CRON_ENVIAR_TICKET');
  }

  getCronPedirTicket(): boolean {
    return this.configService.get<boolean>('CRON_PEDIR_TICKET');
  }

  async onModuleInit() {
    this.logger.debug('Init TicketInitService');

    const enviarTicket = this.getCronEnviarTicket();
    const pedirTicket = this.getCronPedirTicket();

    //? Cron para saber si hay tickets nuevos
    if (pedirTicket) {
      cron.schedule('*/10 * * * * *', async () => {
        const horaActual = moment().format('HH:mm:ss');
        this.logger.warn(`HORA: ${horaActual} PETICION BOLETO PENDIENTE`);
        await this.GetAndSaveBoletosPendientes();
      });
    }

    //? Cron para Enviar si hay tickets por enviar
    if (enviarTicket) {
      cron.schedule('*/10 * * * * *', async () => {
        const horaActual = moment().format('HH:mm:ss');
        this.logger.warn(`HORA: ${horaActual} ENVIANDO TICKETS PENDIENTES`);
        await this.enviarTicketsPendientes();
      });
    }
  }

  async enviarTicketTelegram(ticket: Ticket) {
    const ticketData = ticket.ticketData;
    const pathPdf = await this.ticketPdfService.saberSiExiste(ticketData);

    if (pathPdf === null) {
      await this.generarPdf(ticketData);
      return;
    }

    //TODO saber si controlo esto oh no
    await this.ticketService.SumarIntentos(ticket._id);

    const user = await this.usersService.findOneByIdTelefono(
      ticketData.contacto,
    );
    if (user === null) {
      this.logger.error('No se puede enviar PDF el usuario aun no existe');
      return;
    }
    if (user.activo === false) {
      this.logger.error('No se puede enviar PDF, el usuario no esta activo');
      return;
    }
    const sendPdf = await this.telegramv2Service.sendPdf(
      user.id_telegram,
      pathPdf,
    );
    if (sendPdf) {
      await this.ticketService.changeEntregado(ticket._id, true);
    }
  }

  async enviarTicketsPendientes() {
    const tickets = await this.ticketService.findAll(false, 5);
    if (tickets.length === 0) {
      this.logger.debug('No hay tickets pendientes por enviar');
    } else {
      this.logger.debug(`Hay ${tickets.length}, boletos pendientes por enviar`);
      for (const ticket of tickets) {
        await this.enviarTicketTelegram(ticket);
      }
    }
  }

  async GetAndSaveBoletosPendientes() {
    const boletos = await this.lotenetService.boletosPendientes();
    await this.guardarBoletosPendiente(boletos);
  }

  async guardarBoletosPendiente(tickets: TicketData[]) {
    if (tickets.length === 0) {
      this.logger.debug('NO HAY BOLETOS PENDIENTES');
      return;
    }
    for (const boleto of tickets) {
      const createTicket: CreateTicketDto = {
        entregado: false,
        ticketData: boleto,
        serial_ticket: boleto.serialkey,
        contacto: boleto.contacto,
      };
      const boletoSaved = await this.ticketService.create(createTicket);
      if (boletoSaved) {
        await this.generarPdf(boleto);
      }
    }
  }

  async generarPdf(ticket: TicketData) {
    try {
      await this.ticketPdfService.buildTicketPDF(ticket);
    } catch (e) {
      this.logger.error(`Error creando PDF ${e}`);
    }
  }
}
