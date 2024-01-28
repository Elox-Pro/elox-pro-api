import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './app.config';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const apiConfig = app.get<AppConfig>(AppConfig);
  await app.listen(apiConfig.PORT);

}

bootstrap();
