import { Module } from '@nestjs/common';
import { AppConfig } from '@app/app.config';
import { AuthenticationModule } from '@app/authentication/authentication.module';
import { PrismaModule } from '@app/prisma/prisma.module';
import { GRecaptchaModule } from '@app/grecaptcha/grecaptcha.module';

@Module({
    imports: [
        PrismaModule,
        AuthenticationModule,
        GRecaptchaModule
    ],
    providers: [
        AppConfig
    ]
})
export class TestModule { }
