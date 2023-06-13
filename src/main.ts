import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/middlewares/HttpExceptionFilter';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'development' ? ['error', 'warn', 'debug'] : [],
    cors:
      process.env.NODE_ENV === 'development'
        ? true
        : {
            origin: [],
            credentials: true,
          },
  });

  app.setGlobalPrefix('/api');

  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
  console.log('App start at:', await app.getUrl());
}
bootstrap();
