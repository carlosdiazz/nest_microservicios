import { Injectable, Logger, NotFoundException } from '@nestjs/common';

//Propio
import { ResponsePopio } from './../../common/common';
import { MESSAGE } from './../../config/config';
import { SendMessageDto, VerifyContactDto } from './dto/send-message.dto';
import { Telegramv2Service, UsersService } from '../components';

@Injectable()
export class ApiLotenetService {
  constructor(
    private readonly telegramv2Service: Telegramv2Service,
    private readonly userService: UsersService,
  ) {}

  private readonly logger = new Logger('ApiLotenetService');

  async sendMessage(sendMessageDto: SendMessageDto): Promise<ResponsePopio> {
    this.logger.log(`sendMessage => ${JSON.stringify(sendMessageDto)}`);
    const mensaje = await this.telegramv2Service.sendMessage(sendMessageDto);
    if (mensaje === false) {
      throw new NotFoundException(MESSAGE.NO_SE_ENVIO_EL_MENSAJE);
    }
    return {
      statusCode: 200,
      error: null,
      message: MESSAGE.MENSAJE_ENVIADO,
    };
  }

  async verifyContacto(
    verifyContactDto: VerifyContactDto,
  ): Promise<ResponsePopio> {
    this.logger.log(`verifyContacto => ${JSON.stringify(verifyContactDto)}`);
    //TODO
    //const user = await this.userService.findOneByIdTelefono(
    //  verifyContactDto.contacto,
    //);
    //if (user === null) {
    //  throw new NotFoundException(MESSAGE.EL_CONTACTO_NO_ESTA);
    //}
    return {
      statusCode: 200,
      message: MESSAGE.EL_CONTACTO_ESTA,
      error: null,
    };
  }
}
