import { Global, Module } from "@nestjs/common";
import { CommonConfig } from "./config/common.config";
import { HashingStrategy } from "./strategies/hashing/hashing.strategy";
import { BCryptStategy } from "./strategies/hashing/bcrypt.strategy";
@Global()
@Module({
    exports: [
        CommonConfig,
        HashingStrategy,
    ],
    providers: [
        CommonConfig,
        {
            provide: HashingStrategy,
            useClass: BCryptStategy,
        },
    ]
})
export class CommonModule { }