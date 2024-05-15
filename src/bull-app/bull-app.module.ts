import { EMAIL_QUEUE } from "@app/email/constants/email.constants";
import { RedisConfig } from "@app/redis/redis.config";
import { RedisModule } from "@app/redis/redis.module";
import { TFA_STRATEGY_QUEUE } from "@app/tfa/constants/tfa.constants";
import { BullModule } from "@nestjs/bull";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [RedisModule],
            useFactory: async (config: RedisConfig) => ({
                redis: {
                    port: config.PORT,
                    host: config.HOST,
                    db: config.DB,
                },
            }),
            inject: [RedisConfig],
        }),
        BullModule.registerQueue({
            name: TFA_STRATEGY_QUEUE
        }),
        BullModule.registerQueue({
            name: EMAIL_QUEUE
        }),
    ],
    exports: [BullModule]
})
export class BullAppModule { }