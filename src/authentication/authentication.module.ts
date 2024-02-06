import { Module } from '@nestjs/common';
import { BCryptStategy } from './strategies/hashing/bcrypt.strategy';
import { HashingStrategy } from './strategies/hashing/hashing.strategy';
import { EmailTfaStrategy } from './strategies/tfa/email-tfa.strategy';
import { TfaFactory } from './factories/tfa.factory';
import { AuthenticationController } from './controllers/authentication.controller';
import { LoginUC } from './usecases/login.uc';
import { EmailModule } from 'common/email/email.module';
import { RedisModule } from 'redis/redis.module';
import { PrismaModule } from 'prisma/prismal.module';
import { BullModule } from '@nestjs/bull';
import { TFA_STRATEGY_QUEUE } from './constants/authentication.constants';
import { TfaStrategyProcessor } from './processors/tfa.strategy.processor';
import { JwtConfig } from './config/jwt.config';
import { JwtStrategy } from './strategies/jwt/jwt.strategy';
import { JwtRedisStrategy } from './strategies/jwt/jwt-redis.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ValidateTfaUC } from './usecases/validate-tfa.uc';
import { TfaStrategy } from './strategies/tfa/tfa.strategy';

@Module({

    imports: [
        RedisModule,
        EmailModule,
        PrismaModule,
        BullModule.registerQueue({
            name: TFA_STRATEGY_QUEUE
        }),
        JwtModule.register({}),
    ],
    controllers: [
        AuthenticationController
    ],
    providers: [
        LoginUC,
        ValidateTfaUC,
        EmailTfaStrategy,
        TfaFactory,
        TfaStrategyProcessor,
        JwtConfig,
        {
            provide: JwtStrategy,
            useClass: JwtRedisStrategy
        },
        {
            provide: HashingStrategy,
            useClass: BCryptStategy,
        }
    ]
})
export class AuthenticationModule {
}
