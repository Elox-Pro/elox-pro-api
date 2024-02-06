import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { AppConfig } from './app.config';
import { RedisModule } from './redis/redis.module';
import { BullModule } from '@nestjs/bull';
import { RedisConfig } from './redis/redis.config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [RedisModule],
      useFactory: async (config: RedisConfig) => ({
        redis: {
          port: config.PORT,
          host: config.HOST
        },
      }),
      inject: [RedisConfig],
    }),
    AuthenticationModule
  ],
  providers: [
    AppConfig
  ]
})
export class AppModule { }
