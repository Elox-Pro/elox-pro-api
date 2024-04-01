import { Global, Module } from "@nestjs/common";
import { CommonConfig } from "./config/common.config";
import { HashingStrategy } from "./strategies/hashing/hashing.strategy";
import { BCryptStategy } from "./strategies/hashing/bcrypt.strategy";
import { SessionCookieService } from "./services/session-cookie.service";
@Global()
@Module({
    exports: [
        CommonConfig,
        HashingStrategy,
        SessionCookieService
    ],
    providers: [
        CommonConfig,
        SessionCookieService,
        {
            provide: HashingStrategy,
            useClass: BCryptStategy,
        },
    ]
})
export class CommonModule { }