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
import { BullModule } from '@nestjs/bull';
import { TFA_STRATEGY_QUEUE } from './constants/authentication.constants';
import { TfaStrategyProcessor } from './processors/tfa.strategy.processor';

@Module({

    imports: [
        RedisModule,
        EmailModule,
        PrismaModule,
        BullModule.registerQueue({
            name: TFA_STRATEGY_QUEUE
        })
    ],
    controllers: [
        AuthenticationController
    ],
    providers: [
        EmailTfaStrategy,
        TfaFactory,
        LoginUC,
        TfaStrategyProcessor,
        {
            provide: HashingStrategy,
            useClass: BCryptStategy,
        }
    ]
})
export class AuthenticationModule {
}
