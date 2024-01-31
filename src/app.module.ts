import { Module } from '@nestjs/common';
import { CountryModule } from './country/country.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './app.config';
import { EmailModule } from './common/email/email.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CountryModule,
    AuthenticationModule,
    EmailModule,
    RedisModule
  ],
  providers: [
    AppConfig
  ]
})
export class AppModule { }
