import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './infrastructure/common/interceptors/logger/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors();
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(process.env.SERVER_PORT, () =>
    console.log(`Server listening on port ${process.env.SERVER_PORT}` || 3000),
  );
}
bootstrap();
