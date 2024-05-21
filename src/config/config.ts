import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export const config = registerAs('config', () => {
  return {
    //URI_MONGO: process.env.URI_MONGO,
    //MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    PORT: process.env.PORT,
    //STATE: process.env.STATE,
    DATABASE_URL: process.env.DATABASE_URL,
  };
});

export const validationENV = () => {
  return Joi.object({
    //URI_MONGO: Joi.string().required(),
    //MONGO_DB_NAME: Joi.string().required(),
    PORT: Joi.number().required(),
    //STATE: Joi.string().required(),
    DATABASE_URL: Joi.string().required(),
  });
};

export * from './message';
