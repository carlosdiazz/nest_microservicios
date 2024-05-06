import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const config = registerAs('config', () => {
  return {
    TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
    URI_MONGO: process.env.URI_MONGO,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    PORT: process.env.PORT,
    STATE: process.env.STATE,
    USER_LOTENET: process.env.USER_LOTENET,
    PASSWORD_LOTENET: process.env.PASSWORD_LOTENET,
    URL_LOTENET: process.env.URL_LOTENET,
    URL_API_PREMIOS: process.env.URL_API_PREMIOS,
    CRON_ENVIAR_TICKET: process.env.CRON_ENVIAR_TICKET,
    CRON_PEDIR_TICKET: process.env.CRON_PEDIR_TICKET,
  };
});

export const validationENV = () => {
  return Joi.object({
    TELEGRAM_TOKEN: Joi.string().required(),
    URI_MONGO: Joi.string().required(),
    MONGO_DB_NAME: Joi.string().required(),
    PORT: Joi.number().required(),
    STATE: Joi.string().required(),
    USER_LOTENET: Joi.string().required(),
    PASSWORD_LOTENET: Joi.string().required(),
    URL_LOTENET: Joi.string().required(),
    URL_API_PREMIOS: Joi.string().required(),
    CRON_ENVIAR_TICKET: Joi.boolean().required(),
    CRON_PEDIR_TICKET: Joi.boolean().required(),
  });
};

export * from './message';
