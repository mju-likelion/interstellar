import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', {
    exclude: ['health-check'],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: RegExp(process.env.CORS_ORIGIN),
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
