import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'API-GATEWAY', // Add a prefix to each logged message.
      logLevels: ['log', 'error', 'debug'], // Enable the log levels you want to log
      // json: true // Enables JSON logging in the application.
    }),
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
