import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { GrammyArgumentsHost } from '@grammyjs/nestjs';

@Catch()
export class GrammyExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('AxiosService');
  async catch(exception: Error, host: ArgumentsHost): Promise<void> {
    const grammyHost = GrammyArgumentsHost.create(host);
    const ctx = grammyHost.getContext();
    this.logger.error(
      `Ha ocurrido un error en el Bot de Telegram => ${exception.message}`,
    );
    await ctx.reply(`Ha ocurrido un error, intente mas tarde`);
  }
}
