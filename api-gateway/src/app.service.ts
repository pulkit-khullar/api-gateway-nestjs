import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    this.logger.log(`Working logger? : ${this.configService.get('NODE_ENV')}`);
    return 'Hello World!';
  }
}
