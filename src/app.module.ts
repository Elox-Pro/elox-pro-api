import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { AppConfig } from './app.config';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { HealthModule } from './health/health.module';
import { I18nImplModule } from './common/i18n-impl/i18n-impl.module';

@Module({
  imports: [
    I18nImplModule,
    PrismaModule,
    AuthenticationModule,
    AuthorizationModule,
    UserModule,
    HealthModule
  ],
  providers: [AppConfig]
})
export class AppModule { }