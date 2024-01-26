import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app.config.module';
import { CountryModule } from './country/country.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AppConfigModule,
    CountryModule,
    PrismaModule
  ]
})
export class AppModule { }
