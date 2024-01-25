import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiConfig } from './config/api/api.config';
async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const apiConfig = app.get<ApiConfig>(ApiConfig);
  await app.listen(apiConfig.PORT);
}
bootstrap();
