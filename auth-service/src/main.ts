import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  /**
   * Setting baseurl for all the API end-points in the application
   */
  app.setGlobalPrefix(configService.get<string>('API_BASEPATH') || '');

  /**
   * Pick application port from ENV
   */
  await app.listen(configService.get<number>('PORT') ?? 3000);
}
bootstrap();
