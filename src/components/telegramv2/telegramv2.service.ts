import { Logger, UseFilters } from '@nestjs/common';
import { Ctx, InjectBot, Start, Update, On, Command } from '@grammyjs/nestjs';
import { Bot, Context, InputFile } from 'grammy';

//Propio;
import {
  ARR_MES_cuenta_eliminada,
  ARR_MES_NO_REGISTRO,
  ARR_MES_Saludo,
  messsageTelegram,
} from './message';
import { ACCION } from './constants';
import { RegisterService } from './flujos/register.service';
import { ConsultaLotenetService } from './flujos/consulta.lotenet.service';
import { SendMessageDto } from '../lotenet/dto/send-message.dto';

import { User, UsersService } from '../components';
import { GrammyExceptionFilter } from './grammy-exeption';

@UseFilters(GrammyExceptionFilter)
@Update()
export class Telegramv2Service {
  constructor(
    @InjectBot()
    private readonly bot: Bot<Context>,
    private readonly userService: UsersService,
    private readonly res: RegisterService,
    private readonly consultarLotenet: ConsultaLotenetService,
  ) {
    this.bot.api.setMyCommands([
      { command: 'start', description: 'Comando para iniciar' },
      { command: 'informacion', description: 'Informacion del usuario' },
      {
        command: 'desvincular',
        description: 'Comando para desvincular cuenta',
      },
    ]);
  }
  private readonly logger = new Logger('Telegramv2Service');

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<any> {
    await ctx.reply(messsageTelegram(ARR_MES_Saludo));
    await this.flujo(ctx);
  }

  @Command('desvincular')
  async desvincular(@Ctx() ctx: Context): Promise<any> {
    const user = await this.userService.findOneByIdTelegram(ctx.from.id);
    if (!user) {
      await this.flujo(ctx);
    } else {
      await this.userService.remove(ctx.from.id);
      await ctx.reply(messsageTelegram(ARR_MES_cuenta_eliminada));
    }
    return;
  }

  @Command('informacion')
  async informacion(@Ctx() ctx: Context): Promise<any> {
    const user = await this.userService.findOneByIdTelegram(ctx.from.id);
    if (!user) {
      await ctx.reply(messsageTelegram(ARR_MES_NO_REGISTRO));
      return;
    }
    await ctx.reply(
      `Nombre: ${user.nombre}\nCedúla: ${user.cedula}\nTeléfono: ${user.telefono}`,
    );
  }

  @On('message')
  async onMessage(@Ctx() ctx: Context): Promise<any> {
    await this.flujo(ctx);
    return;
  }

  async flujo_usuario_activo(@Ctx() ctx: Context) {
    await this.consultarLotenet.menu(ctx);
  }

  async flujo_usuario_inactivo(@Ctx() ctx: Context, user: User) {
    if (!user.nombre) {
      if (user.accion == ACCION.nombre_preguntar) {
        await this.res.registrarNombre(ctx);
      } else {
        await this.res.preguntarNombre(ctx);
      }
      return;
    }
    if (!user.cedula) {
      if (user.accion == ACCION.cedula_preguntar) {
        await this.res.registrarCedula(ctx);
      } else {
        await this.res.preguntarCedula(ctx);
      }
      return;
    }
    if (!user.telefono) {
      if (ctx.message.contact) {
        await this.res.registrarNumero(ctx);
      } else {
        await this.res.preguntarNumero(ctx);
      }
      return;
    }
  }

  async flujo(@Ctx() ctx: Context) {
    const user = await this.userService.findOneByIdTelegram(ctx.from.id);
    if (!user) {
      await this.res.registroPrimeraVez(ctx);
      return;
    }
    if (!user.activo) {
      await this.flujo_usuario_inactivo(ctx, user);
    } else {
      await this.flujo_usuario_activo(ctx);
    }
  }

  async sendPdf(id_telegram: number, pdfPath: string): Promise<boolean> {
    try {
      this.logger.debug('Enviando PDF de boleto a Telegram');
      await this.bot.api.sendDocument(id_telegram, new InputFile(pdfPath));
      return true;
    } catch (e) {
      this.logger.error(`No se envio el PDF => ${e}`);
      return false;
    }
  }

  async existeNumero(contacto: string): Promise<boolean> {
    try {
      //const contact = await this.bot.api.getChatMember(898083122, 'carlos');
      //console.log(contact);
    } catch (e) {
      console.log(e);
    }

    console.log('OK');
    return false;
  }

  async sendMessage(sendMessageDto: SendMessageDto): Promise<boolean> {
    try {
      const user = await this.userService.findOneByIdTelefono(
        sendMessageDto.contacto,
      );
      if (user === null) return false;

      await this.bot.api.sendMessage(
        user.id_telegram,
        `${sendMessageDto.header}\n\n${sendMessageDto.body}`,
      );

      return true;
    } catch (e) {
      this.logger.error(`Error sendMessage => ${e}`);
      return false;
    }
  }
}
