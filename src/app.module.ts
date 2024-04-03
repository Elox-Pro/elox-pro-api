import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { HealthModule } from './health/health.module';
import { I18nAppModule } from './i18n-app/i18n-app.module';
import { GRecaptchaModule } from './grecaptcha/grecaptcha.module';
import { RecoverPasswordModule } from './recover-password/recover-password.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';
import { BullAppModule } from './bull-app/bull-app.module';
import { TfaModule } from './tfa/tfa.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    // Global Modules
    BullAppModule,
    CommonModule,
    EmailModule,
    GRecaptchaModule,
    I18nAppModule,
    PrismaModule,
    RedisModule,
    // Local Modules
    AuthenticationModule,
    AuthorizationModule,
    HealthModule,
    RecoverPasswordModule,
    TfaModule,
    UserModule,
  ]
})
export class AppModule { }