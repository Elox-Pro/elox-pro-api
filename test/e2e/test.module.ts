import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma/prisma.module';
import { GRecaptchaModule } from '@app/grecaptcha/grecaptcha.module';
import { BullAppModule } from '@app/bull-app/bull-app.module';
import { CommonModule } from '@app/common/common.module';
import { EmailModule } from '@app/email/email.module';
import { I18nAppModule } from '@app/i18n-app/i18n-app.module';
import { RedisModule } from '@app/redis/redis.module';

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
    ]
})
export class TestModule { }
