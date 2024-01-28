import { Module } from '@nestjs/common';
import { CountryModule } from './country/country.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CountryModule,
    AuthenticationModule
  ],
  providers: [
    AppConfig
  ]
})
export class AppModule { }
