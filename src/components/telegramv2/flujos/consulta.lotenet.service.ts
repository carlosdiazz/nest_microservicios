import * as QRCode from 'qrcode';
import * as fs from 'fs';
import * as path from 'path';

import { Ctx, InjectBot, Update, CallbackQuery } from '@grammyjs/nestjs';
import { Bot, Context, InlineKeyboard, InputFile } from 'grammy';

//Propio

import { LotenetService } from './../../../components/lotenet/lotenet.service';
import { ApiPremios, DATA_BUTTON } from '../constants';
import { TicketService } from './../../../components/lotenet/ticket.service';
import {
  ARR_MES_Aun_no_pagos,
  ARR_MES_no_boleto_gandores,
  ARR_MES_NO_REGISTRO,
  ARR_MES_Seleccione_opcion,
  Boleto,
  messsageTelegram,
  User,
  UsersService,
} from './../../../components/components';
import { GrammyExceptionFilter } from '../grammy-exeption';
import { UseFilters } from '@nestjs/common';

@UseFilters(GrammyExceptionFilter)
@Update()
export class ConsultaLotenetService {
  constructor(
    @InjectBot()
    private readonly bot: Bot<Context>,
    private readonly userService: UsersService,
    private readonly lotenetService: LotenetService,
    private readonly ticketService: TicketService,
  ) {}

  async menu(@Ctx() ctx: Context): Promise<any> {
    const inlineKeyboard = new InlineKeyboard()
      .text('Boletos Vigentes', DATA_BUTTON.boletos_vigentes)
      .row()
      .text('Boletos Ganadores', DATA_BUTTON.boletos_ganadores)
      .row()
      .text('Boletos Pendientes', DATA_BUTTON.boletos_pendientes)
      .row()
      .text('Últimos Boletos Pagados', DATA_BUTTON.boletos_pagados)
      .row()
      .text('Últimos Resultados', DATA_BUTTON.ultimos_resultados)
      .row();
    await ctx.reply(messsageTelegram(ARR_MES_Seleccione_opcion), {
      reply_markup: inlineKeyboard,
    });
  }

  @CallbackQuery(DATA_BUTTON.ultimos_resultados)
  async onCallbackUltimosResultados(@Ctx() ctx: Context) {
    await ctx.answerCallbackQuery({
      text: 'Haz seleccionado Resultados de Hoy',
    });
    const message = this.formartButtonResultados();
    await ctx.reply('Cual Resultados quieres consultar\n\n', {
      reply_markup: message,
    });
  }

  @CallbackQuery(/resultados_api=/)
  async onCallbackApiReusltado(@Ctx() ctx: Context) {
    const sorteo_api_button = ctx.callbackQuery.data;
    const sorteo_api = this.extraerCodigo(sorteo_api_button);
    await ctx.answerCallbackQuery({
      text: `El ultimo resultado es: `,
    });
    const response =
      await this.lotenetService.resultadosApiTelegram(sorteo_api);
    if (response) {
      await ctx.reply(
        `Nombre: ${response.nombre_sorteo}\nFecha: ${response.fecha}\nNumeros ganadores: ${response.numeros_ganadores.join('-')}`,
      );
      return;
    }
    await ctx.reply(`No se encontraron resultados`);
    return;
  }

  formartButtonResultados(): InlineKeyboard {
    const buttons = new InlineKeyboard();
    const api = ApiPremios;
    api.forEach((apipremio) => {
      buttons
        .text(
          `${apipremio.nombre_sorteo}`,
          `${DATA_BUTTON.resultados_api}=${apipremio.nombre_api}`,
        )
        .row();
    });

    return buttons;
  }

  async mensajeUsuarioNoRegistrado(@Ctx() ctx: Context): Promise<User | null> {
    const user = await this.userService.findOneByIdTelegram(ctx.from.id);
    if (!user) {
      await ctx.reply(messsageTelegram(ARR_MES_NO_REGISTRO));
      return null;
    }
    return user;
  }

  @CallbackQuery(DATA_BUTTON.boletos_vigentes)
  async onCallbackBoletosVigentes(@Ctx() ctx: Context) {
    await ctx.answerCallbackQuery({
      text: 'Haz seleccionado Boletos Vigentes',
    });
    const user = await this.mensajeUsuarioNoRegistrado(ctx);
    if (user === null) return;
    const response = await this.lotenetService.boletosVigentesTelegram(
      user.telefono,
    );

    const message = this.formartTextBoleto(response, 'Mis Boletos Vigentes');
    await ctx.reply(message);
  }

  @CallbackQuery(DATA_BUTTON.boletos_pendientes)
  async onCallbackBoletosPendientes(@Ctx() ctx: Context) {
    await ctx.answerCallbackQuery({
      text: 'Haz seleccionado Boletos Pendientes',
    });
    const user = await this.mensajeUsuarioNoRegistrado(ctx);
    if (user === null) return;

    const tickets = await this.ticketService.findBoletosPendientesByContacto(
      user.telefono,
    );
    if (tickets.length === 0) {
      await ctx.reply('No tienes boletos pendientes');
      return;
    }
    await ctx.reply(`Tienes ${tickets.length}, boletos pendientes`);
    return;
  }

  @CallbackQuery(DATA_BUTTON.boletos_ganadores)
  async onCallbackBoletosGandores(@Ctx() ctx: Context) {
    await ctx.answerCallbackQuery({
      text: 'Haz seleccionado Boletos Ganadores',
    });
    const user = await this.mensajeUsuarioNoRegistrado(ctx);
    if (user === null) return;
    const response = await this.lotenetService.boletosVigentesTelegram(
      user.telefono,
      true,
    );
    if (response.length === 0) {
      await ctx.reply(messsageTelegram(ARR_MES_no_boleto_gandores));
      return;
    }
    const message = this.formartButtonBoleto(response);
    await ctx.reply('Tus boletos ganadores\n\n', {
      reply_markup: message,
    });
  }

  @CallbackQuery(DATA_BUTTON.boletos_pagados)
  async onCallbackBoletosPagados(@Ctx() ctx: Context) {
    await ctx.answerCallbackQuery({
      text: 'Haz seleccionado Boletos Pagados',
    });
    const user = await this.mensajeUsuarioNoRegistrado(ctx);
    if (user === null) return;
    const response = await this.lotenetService.boletosPagadosPorUsuarioTelegram(
      user.telefono,
    );
    if (response.length === 0) {
      await ctx.reply(messsageTelegram(ARR_MES_Aun_no_pagos));
      return;
    }
    const message = this.formartTextBoleto(response, 'Mis Boletos Pagados: ');
    await ctx.reply(message);
  }

  @CallbackQuery(/code_ganador=/)
  async onCallbackGenerarCodigo(@Ctx() ctx: Context) {
    const serial = ctx.callbackQuery.data;
    const newSerial = this.extraerCodigo(serial);
    await ctx.answerCallbackQuery({
      text: `Haz seleccionado ${newSerial}`,
    });
    const user = await this.userService.findOneByIdTelegram(ctx.from.id);
    const ping_pago = await this.lotenetService.pinPagoTelegram(
      user.telefono,
      newSerial,
    );
    if (ping_pago === null) return;
    const imagen = await this.generarYGuardarQR(ping_pago.datos.pin_pago);
    if (imagen) {
      await ctx.replyWithPhoto(new InputFile(imagen));
    } else {
      await ctx.reply('Error generando Imagen');
    }
  }

  extraerCodigo(cadena: string) {
    const partes = cadena.split('=');
    if (partes.length === 2) {
      return partes[1];
    } else {
      return null;
    }
  }

  async generarYGuardarQR(codigo: string): Promise<string> {
    const rutaCarpeta = path.join(__dirname, '..', '..', '..', 'code_image');
    const nombreArchivo = `${codigo}.png`;
    const rutaCompleta = path.join(rutaCarpeta, nombreArchivo);

    try {
      // Verificar si la carpeta existe, si no, crearla
      if (!fs.existsSync(rutaCarpeta)) {
        fs.mkdirSync(rutaCarpeta, { recursive: true });
      }

      // Generar el código QR
      await QRCode.toFile(rutaCompleta, codigo, { scale: 10 });

      return rutaCompleta;
    } catch (error) {
      console.error('Error al generar el código QR:', error);
      return null;
    }
  }

  formartButtonBoleto(boletos: Boleto[]): InlineKeyboard {
    const buttons = new InlineKeyboard();
    boletos.forEach((boleto) => {
      buttons
        .text(
          `Serial: ${boleto.serialkey}`,
          `${DATA_BUTTON.code_ganador}=${boleto.serialkey}`,
        )
        .row();
    });

    return buttons;
  }

  formartTextBoleto(boletos: Boleto[], titulo: string): string {
    let response = `${titulo}\n\n`;
    if (boletos.length === 0) {
      response += '\n--- No tiene Boletos disponibles ---\n';
    } else {
      response += boletos
        .map(
          (boleto) =>
            `\nTicket: ${boleto.serialkey}\nSorteo: ${boleto.sorteo_nombre}\nFecha: ${this.formartFecha(boleto.fecha_ticket)}\nTotal: ${boleto.monto_jugado}`,
        )
        .join('\n\n');
    }

    return response;
  }

  formartFecha(fecha: string): string {
    const newFecha = new Date(fecha);
    //${newFecha.toLocaleTimeString()}
    return `${newFecha.toLocaleDateString()}`;
  }
}

//@CallbackQuery('primero')
//async onCallback(@Ctx() ctx: Context) {
//  console.log(ctx);
//  return ctx.answerCallbackQuery({
//    text: 'You were curious, indeed!',
//  });
//}

//log('onStart!!', this.bot ? this.bot.botInfo.first_name : '(booting)');
//return ctx.reply('Curious? Click me!', {
//  reply_markup: this.inlineKeyboard,
//});
//const inlineKeyboard = new InlineKeyboard()
//  .text('432342432423432', 'primero')
//  .text('432342432423432', 'anterior')
//  .text('432342432423432', 'actual')
//  .text('432342432423432', 'siguiente')
//  .text('432342432423432', 'último');
//await ctx.reply('text', {
//  reply_markup: inlineKeyboard,
//});
//ctx.reply('<i>Hello!</i>', { parse_mode: 'HTML' });
//
//const keyboard = new Keyboard()
//  .text('Yes, they certainly are')
//  .row()
//  .text("I'm not quite sure")
//  .row()
//  .text('No. 😈')
//  .resized() // Ajusta el tamnao d elos botnes al texto
//  .selected()
//  //.placeholder('Hey qloq') // Mensaje por defectp
//  .oneTime(); // Solo Mostrar una vez
////.persistent() //Por defexcto sera el eclado qeu seimpre estara;
//
//ctx.reply('hey', {
//  reply_markup: keyboard,
//});
//
//await ctx.reply('text', {
//  reply_markup: { remove_keyboard: true },
//});
//return ctx.reply('Curious? Click me!', {
//  reply_markup: this.inlineKeyboard,
//});
//
