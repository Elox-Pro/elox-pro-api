import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AppConfig } from '@app/app.config';
import { AuthenticationModule } from '@app/authentication/authentication.module';
import { RedisModule } from '@app/redis/redis.module';
import { RedisConfig } from '@app/redis/redis.config';

@Module({
    imports: [
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
        AuthenticationModule
    ],
    providers: [
        AppConfig
    ]
})
export class TestModule { }
