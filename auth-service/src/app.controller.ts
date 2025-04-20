import { Controller, Get, Header, Headers, Logger, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller('/auth')
export class AppController {
  logger: Logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(@Headers('x-api-gateway') apiGatewayHeader: string): string {
    return this.appService.getHello();
  }

  @Get('/error')
  async getError(
    @Headers('x-api-gateway') apiGatewayHeader: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const data = this.appService.getError();
      res.status(200).send();
    } catch (error) {
      this.logger.error(error.message);
      res.status(500).json({ message: error.message });
    }
  }

  @Get('/unhandled-error')
  async getUnhandledError(): Promise<void> {
    this.appService.getError();
  }
}
