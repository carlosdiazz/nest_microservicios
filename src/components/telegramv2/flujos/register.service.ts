import { Bot, Context } from 'grammy';
import { Ctx, InjectBot, Update } from '@grammyjs/nestjs';

//Propio
import {
  ARR_MES_NO_Registrado,
  ARR_MES_Nume_Inco,
  ARR_MES_Preguntar_Cedula,
  ARR_MES_Preguntar_Nombre,
  ARR_MES_Preguntar_Numero,
  ARR_MES_Registro_Final,
  ARR_MES_Validar_Cedula,
  ARR_MES_Validar_Texto,
  messsageTelegram,
} from '../message';
import { ACCION } from '../constants';
import { ConsultaLotenetService } from './consulta.lotenet.service';
import { UsersService } from './../../../components/components';
import { UseFilters } from '@nestjs/common';
import { GrammyExceptionFilter } from '../grammy-exeption';

@UseFilters(GrammyExceptionFilter)
@Update()
export class RegisterService {
  constructor(
    @InjectBot()
    private readonly bot: Bot<Context>,
    private readonly userService: UsersService,
    private readonly consultaLotenet: ConsultaLotenetService,
  ) {}

  async registroPrimeraVez(@Ctx() ctx: Context): Promise<any> {
    await this.userService.create({
      id_telegram: ctx.from.id,
    });
    await ctx.reply(messsageTelegram(ARR_MES_NO_Registrado));
    await this.preguntarNombre(ctx);
  }

  async preguntarNombre(@Ctx() ctx: Context): Promise<any> {
    await this.userService.update(ctx.from.id, {
      accion: ACCION.nombre_preguntar,
    });
    await ctx.reply(messsageTelegram(ARR_MES_Preguntar_Nombre));
  }

  async preguntarCedula(@Ctx() ctx: Context): Promise<any> {
    await this.userService.update(ctx.from.id, {
      accion: ACCION.cedula_preguntar,
    });
    await ctx.reply(messsageTelegram(ARR_MES_Preguntar_Cedula));
  }

  async registroFinalizado(@Ctx() ctx: Context): Promise<any> {
    await this.userService.update(ctx.from.id, {
      accion: ACCION.registro_finalizado,
      activo: true,
    });
    await ctx.reply(messsageTelegram(ARR_MES_Registro_Final));

    const user = await this.userService.findOneByIdTelegram(ctx.from.id);
    await ctx.reply(
      `Nombre: ${user.nombre}\nCedúla: ${user.cedula}\nTeléfono: ${user.telefono}`,
    );
    await this.consultaLotenet.menu(ctx);
  }

  async preguntarNumero(@Ctx() ctx: Context): Promise<any> {
    await this.userService.update(ctx.from.id, {
      accion: ACCION.numero_preguntar,
    });
    await ctx.reply(messsageTelegram(ARR_MES_Preguntar_Numero), {
      reply_markup: {
        keyboard: [
          [
            {
              text: '📲 Pulsa aqui para enviar su número',
              request_contact: true,
            },
          ],
        ],
        one_time_keyboard: true,
      },
    });
  }

  async isInvalidText(@Ctx() ctx: Context): Promise<boolean> {
    const regex = /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ ]+$/;
    const texto = ctx.message.text;
    if (texto && texto.length >= 3 && regex.test(texto)) {
      return false;
    }
    await ctx.reply(messsageTelegram(ARR_MES_Validar_Texto));
    return true;
  }

  async isInValidCedula(@Ctx() ctx: Context): Promise<boolean> {
    const texto = ctx.message.text;
    if (texto && texto.length > 4 && this.esNumero(texto)) {
      return false;
    }
    await ctx.reply(messsageTelegram(ARR_MES_Validar_Cedula));
    return true;
  }

  esNumero(texto: string): boolean {
    return /^[0-9]+$/.test(texto);
  }

  async registrarNombre(@Ctx() ctx: Context): Promise<any> {
    const validarTexto = await this.isInvalidText(ctx);
    if (validarTexto) return;

    const nombre = ctx.message.text;

    await this.userService.update(ctx.from.id, {
      nombre: nombre,
      accion: ACCION.nombre_guardado,
    });
    await ctx.reply(`Nombre Guardado: ${nombre} `);
    await this.preguntarCedula(ctx);
  }

  async registrarCedula(@Ctx() ctx: Context): Promise<any> {
    const validarCedula = await this.isInValidCedula(ctx);
    if (validarCedula) return;

    const cedula = ctx.message.text;

    await this.userService.update(ctx.from.id, {
      cedula: cedula,
      accion: ACCION.cedula_guardada,
    });

    await ctx.reply(`Cedula Guardada: ${cedula} `);
    await this.preguntarNumero(ctx);
  }

  async registrarNumero(@Ctx() ctx: Context): Promise<any> {
    const contacto = ctx.message.contact;
    if (contacto.vcard) {
      await ctx.reply(messsageTelegram(ARR_MES_Nume_Inco));
      return;
    }

    const numero = contacto.phone_number;
    await this.userService.update(ctx.from.id, {
      telefono: numero,
      accion: ACCION.numero_gurdado,
    });
    await ctx.reply(`Número Guardado: ${numero} `, {
      reply_markup: {
        remove_keyboard: true,
      },
    });
    await this.registroFinalizado(ctx);
  }
}
