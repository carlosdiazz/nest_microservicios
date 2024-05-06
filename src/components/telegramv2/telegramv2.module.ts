import { Global, Module } from '@nestjs/common';
import {
  ConsultaLotenetService,
  RegisterService,
  Telegramv2Controller,
  Telegramv2Service,
} from './telegramv2';

@Global()
@Module({
  controllers: [Telegramv2Controller],
  providers: [Telegramv2Service, RegisterService, ConsultaLotenetService],
  exports: [Telegramv2Service],
})
export class Telegramv2Module {}
