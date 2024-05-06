import { Controller } from '@nestjs/common';
import { Telegramv2Service } from './telegramv2.service';

@Controller('telegramv2')
export class Telegramv2Controller {
  constructor(private readonly telegramv2Service: Telegramv2Service) {}
}
