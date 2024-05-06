import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

//Propio
import { AxiosModule } from './../../common/common';

import { LotenetService } from './lotenet.service';
import { LotenetController } from './lotenet.controller';
import { TicketInitService } from './ticket_init.service';
import { Ticket, TicketSchema } from './entity/ticket.entity';
import { TicketPdfService } from './ticket_pdf.service';
import { ApiLotenetService } from './api-lotenet.service';
import { TicketService } from './ticket.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
    AxiosModule,
  ],
  controllers: [LotenetController],
  providers: [
    LotenetService,
    TicketService,
    TicketInitService,
    TicketPdfService,
    ApiLotenetService,
  ],
  exports: [LotenetService, TicketService],
})
export class LotenetModule {}
