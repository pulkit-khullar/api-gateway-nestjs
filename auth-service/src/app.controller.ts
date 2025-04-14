import { Controller, Get, Header, Headers } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Headers('x-api-gateway') apiGatewayHeader: string ): string {
    console.log(apiGatewayHeader)
    return this.appService.getHello();
  }
}
