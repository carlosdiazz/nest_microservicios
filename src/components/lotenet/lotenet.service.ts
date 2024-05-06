import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

//Propio
import { AxiosService } from './../../common/common';
import {
  Boleto,
  ResponseBoletos,
  ResponsePinPago,
} from './interfaces/boletos.interface';
import { TicketData } from './interfaces/ticketdata.interface';
import { ResponseResultadosApi } from '../telegramv2/interface/api-reusltados.interface';
import { ApiPremios } from '../components';

@Injectable()
export class LotenetService implements OnModuleInit {
  constructor(private readonly axios: AxiosService) {}

  private readonly logger = new Logger('LotenetService');

  async onModuleInit() {
    this.logger.debug('Init Lotenet Service');
  }

  async boletosPendientes(): Promise<TicketData[]> {
    const url = `api/servicio/boletos/pendientes_electronico`;
    const params = {
      via: 'telegram',
    };
    const response = await this.axios.get(url, params);
    if (response) return response.data.datos;
    return [];
  }

  async boletosVigentes(
    via: string,
    contacto: string,
    ganadores: boolean,
  ): Promise<ResponseBoletos | null> {
    const url = `api/servicio/boletos/vigentes_electronico`;
    const params = {
      via,
      contacto,
      ganadores,
    };
    const response = await this.axios.get(url, params);
    if (response) return response.data;
    return null;
  }

  async boletosPagadosPorUsuario(
    via: string,
    contacto: string,
  ): Promise<ResponseBoletos | null> {
    const url = `api/servicio/boletos/ultimos_pagados_por_contacto`;
    const params = {
      via,
      contacto,
    };
    const response = await this.axios.get(url, params);
    if (response) return response.data;
    return null;
  }

  async generarPinPago(
    via: string,
    contacto: string,
    serialkey: string,
  ): Promise<ResponsePinPago | null> {
    const url = `api/servicio/boletos/generar_pin_para_pago`;
    const params = {
      via,
      contacto,
      serialkey,
    };
    const response = await this.axios.post(url, params);
    if (response) return response.data;
    return null;
  }

  async pinPagoTelegram(
    contacto: string,
    serialKey: string,
  ): Promise<ResponsePinPago | null> {
    return await this.generarPinPago('telegram', contacto, serialKey);
  }

  async boletosPagadosPorUsuarioTelegram(contacto: string): Promise<Boleto[]> {
    const data = await this.boletosPagadosPorUsuario('telegram', contacto);
    if (!data) return [];
    return data.datos;
  }

  async boletosVigentesTelegram(
    contacto: string,
    ganadores: boolean = false,
  ): Promise<Boleto[]> {
    const data = await this.boletosVigentes('telegram', contacto, ganadores);
    if (!data) return [];
    return data.datos;
  }

  async resultadosApi(sorteo_api: string, fecha: string): Promise<string[]> {
    const params = {
      fecha: fecha,
      nombre: sorteo_api,
    };
    const response = await this.axios.getResultados('resultado', params);

    if (response && response.data) {
      if (response.data.resp === 0) {
        return response.data.numeros;
      }
      return [];
    }
    return [];
  }

  async resultadosApiTelegram(
    sorteo_api: string,
  ): Promise<ResponseResultadosApi | null> {
    const fechas = this.getPastDates();
    for (const fecha of fechas) {
      const data = await this.resultadosApi(sorteo_api, fecha);
      if (data.length >= 1) {
        return {
          fecha,
          numeros_ganadores: data,
          nombre_sorteo: this.getNombreSorteo(sorteo_api),
        };
      }
    }
    return null;
  }

  getPastDates(): string[] {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 5; i++) {
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - i);
      const formattedDate = pastDate.toISOString().split('T')[0];
      dates.push(formattedDate);
    }
    return dates;
  }

  getNombreSorteo(nombreApi: string): string {
    for (const apiResultado of ApiPremios) {
      if (apiResultado.nombre_api === nombreApi) {
        return apiResultado.nombre_sorteo;
      }
    }
    return nombreApi;
  }
}
