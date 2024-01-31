import { Module } from '@nestjs/common';
import { BCryptStategy } from './strategies/hashing/bcrypt.strategy';
import { HashingStrategy } from './strategies/hashing/hashing.strategy';
import { EmailTfaStrategy } from './strategies/tfa/email-tfa.strategy';
import { TfaFactory } from './factories/tfa.factory';
import { AuthenticationController } from './controllers/authentication.controller';
import { LoginUC } from './usecases/login.uc';
import { EmailModule } from 'src/common/email/email.module';
import { RedisModule } from 'src/redis/redis.module';
import { PrismaModule } from 'src/prisma/prismal.module';

@Module({

    imports: [
        RedisModule,
        EmailModule,
        PrismaModule,
    ],
    controllers: [
        AuthenticationController
    ],
    providers: [
        EmailTfaStrategy,
        TfaFactory,
        LoginUC,
        {
            provide: HashingStrategy,
            useClass: BCryptStategy,
        }
    ]
})
export class AuthenticationModule {
}
