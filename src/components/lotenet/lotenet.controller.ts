import { Body, Controller, Post } from '@nestjs/common';

//Propio
import { SendMessageDto, VerifyContactDto } from './dto/send-message.dto';
import { ApiLotenetService } from './api-lotenet.service';
import { ResponsePopio } from './../../common/common';

@Controller('lotenet')
export class LotenetController {
  constructor(private readonly apiLotenetService: ApiLotenetService) {}

  @Post('send_message')
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
  ): Promise<ResponsePopio> {
    return await this.apiLotenetService.sendMessage(sendMessageDto);
  }

  @Post('verify_contact')
  async verifyContact(
    @Body() verifyContact: VerifyContactDto,
  ): Promise<ResponsePopio> {
    return await this.apiLotenetService.verifyContacto(verifyContact);
  }
}
