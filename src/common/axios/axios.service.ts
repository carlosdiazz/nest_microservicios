import * as https from 'https';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class AxiosService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.login();
  }

  private readonly logger = new Logger('AxiosService');
  private token: string;
  private agent = new https.Agent({
    rejectUnauthorized: false, // Ignora la verificación del certificado
  });

  getUrl(): string {
    return this.configService.get<string>('URL_LOTENET');
  }
  getUrlApiPremio(): string {
    return this.configService.get<string>('URL_API_PREMIOS');
  }
  getUser(): string {
    return this.configService.get<string>('USER_LOTENET');
  }
  getPassword(): string {
    return this.configService.get<string>('PASSWORD_LOTENET');
  }

  async login() {
    const data = {
      usuario: {
        username: this.getUser(),
        password: this.getPassword(),
      },
    };
    const url = `api/servicio/sessions`;
    try {
      const resp = await this.post(url, data);
      this.token = resp.data.data.jwt_token;
      this.logger.debug('Inicio de session correcto');
    } catch (e) {
      this.manejarErrores(e);
    }
  }

  async get(
    pathUrl: string,
    params: Record<string, any>,
  ): Promise<AxiosResponse | null> {
    const newUrl = `${this.getUrl()}/${pathUrl}`;
    this.logger.verbose(
      `PETICION GET... URL: ${newUrl} PARAMS: ${JSON.stringify(params)}`,
    );
    try {
      return await axios.get(newUrl, {
        params: params,
        httpsAgent: this.agent,
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${this.token}`, // Agrega el token como encabezado
        },
      });
    } catch (e) {
      if (e.response && e.response.status === 401) {
        await this.login();
        return await this.get(pathUrl, params);
      }
      return this.manejarErrores(e);
    }
  }

  async getResultados(
    pathUrl: string,
    params: Record<string, any>,
  ): Promise<AxiosResponse | null> {
    const newUrl = `${this.getUrlApiPremio()}/${pathUrl}`;
    this.logger.verbose(
      `PETICION GET... URL: ${newUrl} PARAMS: ${JSON.stringify(params)}`,
    );
    try {
      return await axios.get(newUrl, {
        params: params,
        httpsAgent: this.agent,
        timeout: 5000,
      });
    } catch (e) {
      return this.manejarErrores(e);
    }
  }

  async post(
    pathUrl: string,
    data: Record<string, any>,
  ): Promise<AxiosResponse | null> {
    const newUrl = `${this.getUrl()}/${pathUrl}`;
    this.logger.verbose(
      `PETICION POST... URL: ${newUrl} DATA: ${JSON.stringify(data)}`,
    );
    try {
      return await axios.post(newUrl, data, {
        httpsAgent: this.agent,
        timeout: 5000,
        headers: {
          Authorization: `Bearer ${this.token}`, // Agrega el token como encabezado
        },
      });
    } catch (e) {
      if (e.response && e.response.status === 401) {
        await this.login();
        return await this.post(pathUrl, data);
      }
      return this.manejarErrores(e);
    }
  }

  manejarErrores(e: any): null {
    if (axios.isAxiosError(e)) {
      const error: AxiosError = e;
      if (e.response && error.response.data) {
        this.logger.error(
          `Error => ${stringifyWithoutObject(error.response.data)}`,
        );
      } else {
        this.logger.error(`Error => no existe DATA en RESPONSE => ${e}`);
      }
      return null;
    } else {
      this.logger.error(`Error desconocido ${e}`);
      return null;
    }
  }
}

function stringifyWithoutObject(obj) {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    return obj.toString();
  }
}
