import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CommonConfig } from './common/config/common.config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));

  const apiConfig = app.get<CommonConfig>(CommonConfig);

  app.enableCors({
    origin: apiConfig.WEB_CLIENT_ORIGIN,
    credentials: true
  });
  app.use(cookieParser());
  await app.listen(apiConfig.PORT);

}


bootstrap();
