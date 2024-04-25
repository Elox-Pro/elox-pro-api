import { Global, Module } from "@nestjs/common";
import { CommonConfig } from "./config/common.config";
import { HashingStrategy } from "./strategies/hashing/hashing.strategy";
import { BCryptStategy } from "./strategies/hashing/bcrypt.strategy";
import { SessionCookieService } from "./services/session-cookie.service";
import { TranslatorService } from "./services/translator.service";
import { EventsGateway } from "./events/events-gateway";
@Global()
@Module({
    exports: [
        CommonConfig,
        HashingStrategy,
        SessionCookieService,
        TranslatorService,
        EventsGateway
    ],
    providers: [
        CommonConfig,
        SessionCookieService,
        TranslatorService,
        EventsGateway,
        {
            provide: HashingStrategy,
            useClass: BCryptStategy,
        },
    ]
})
export class CommonModule { }