import { Module } from '@nestjs/common';
import { BCryptStategy } from './strategies/hashing/bcrypt.strategy';
import { HashingStrategy } from './strategies/hashing/hashing.strategy';
import { EmailTfaStrategy } from './strategies/tfa/email-tfa.strategy';
import { TFAFactory } from './factories/tfa.factory';
import { AuthenticationController } from './controllers/authentication.controller';
import { LoginUC } from './usecases/login.uc';
import { EmailModule } from 'common/email/email.module';
import { RedisModule } from 'redis/redis.module';
import { BullModule } from '@nestjs/bull';
import { TFA_STRATEGY_QUEUE } from './constants/authentication.constants';
import { TfaStrategyProcessor } from './processors/tfa.strategy.processor';
import { JwtConfig } from './config/jwt.config';
import { JwtStrategy } from './strategies/jwt/jwt.strategy';
import { JwtRedisStrategy } from './strategies/jwt/jwt-redis.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ValidateTfaUC } from './usecases/validate-tfa.uc';
import { RedisConfig } from '@app/redis/redis.config';
import { AccessTokenGuard } from './guards/access-token.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication.guard';

@Module({
    imports:
        [
            RedisModule,
            EmailModule,
            BullModule.forRootAsync({
                imports: [RedisModule],
                useFactory: async (config: RedisConfig) => ({
                    redis: {
                        port: config.PORT,
                        host: config.HOST
                    },
                }),
                inject: [RedisConfig],
            }),
            BullModule.registerQueue({
                name: TFA_STRATEGY_QUEUE
            }),
            JwtModule.register({}),
        ],
    controllers:
        [
            AuthenticationController
        ],
    providers:
        [
            {
                provide: JwtStrategy,
                useClass: JwtRedisStrategy
            },
            {
                provide: HashingStrategy,
                useClass: BCryptStategy,
            },
            {

                provide: APP_GUARD,
                useClass: AuthenticationGuard,
            },
            LoginUC,
            ValidateTfaUC,
            EmailTfaStrategy,
            TFAFactory,
            TfaStrategyProcessor,
            AccessTokenGuard,
            JwtConfig
        ]
})
export class AuthenticationModule { }
