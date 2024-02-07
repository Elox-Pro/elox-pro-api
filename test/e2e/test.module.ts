import { Module } from '@nestjs/common';
import { AppConfig } from '@app/app.config';
import { AuthenticationModule } from '@app/authentication/authentication.module';
import { PrismaModule } from '@app/prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        AuthenticationModule
    ],
    providers: [
        AppConfig
    ]
})
export class TestModule { }
