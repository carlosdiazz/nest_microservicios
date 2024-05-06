import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

//Propio
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('NEST-MICROSERVICIOS');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remueve todo lo que no está incluído en los DTOs
      forbidNonWhitelisted: true, // Retorna bad request si hay propiedades en el objeto no requeridas
    }),
  );

  app.setGlobalPrefix('api'); // Establece el prefijo global '/api' para todos los endpoints

  await app.listen(process.env.PORT || 9999, () => {
    logger.debug(
      `👍El server esta arriba en el puerto: ${process.env.PORT || 9999} 👍💪`,
    );
  });
}
bootstrap();
