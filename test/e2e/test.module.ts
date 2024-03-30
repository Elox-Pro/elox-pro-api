import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@app/authentication/authentication.module';
import { PrismaModule } from '@app/prisma/prisma.module';
import { GRecaptchaModule } from '@app/grecaptcha/grecaptcha.module';
import { RecoverPasswordModule } from '@app/recover-password/recover-password.module';
import { BullAppModule } from '@app/bull-app/bull-app.module';
import { CommonModule } from '@app/common/common.module';
import { EmailModule } from '@app/email/email.module';
import { I18nAppModule } from '@app/i18n-app/i18n-app.module';
import { RedisModule } from '@app/redis/redis.module';
import { TfaModule } from '@app/tfa/tfa.module';

@Module({
    imports: [
        AuthenticationModule,
        BullAppModule,
        CommonModule,
        EmailModule,
        GRecaptchaModule,
        I18nAppModule,
        PrismaModule,
        RecoverPasswordModule,
        RedisModule,
        TfaModule,
    ]
})
export class TestModule { }
