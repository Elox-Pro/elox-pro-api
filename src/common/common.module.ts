import { Global, Module } from "@nestjs/common";
import { CommonConfig } from "./config/common.config";
import { HashingStrategy } from "./strategies/hashing/hashing.strategy";
import { BCryptStategy } from "./strategies/hashing/bcrypt.strategy";
import { SessionCookieService } from "./services/session-cookie.service";
import { TranslatorService } from "./services/translator.service";
@Global()
@Module({
    exports: [
        CommonConfig,
        HashingStrategy,
        SessionCookieService,
        TranslatorService
    ],
    providers: [
        CommonConfig,
        SessionCookieService,
        TranslatorService,
        {
            provide: HashingStrategy,
            useClass: BCryptStategy,
        },
    ]
})
export class CommonModule { }