import { Global, Module } from "@nestjs/common";
import { CommonConfig } from "./config/common.config";
import { HashingStrategy } from "./strategies/hashing/hashing.strategy";
import { BCryptStategy } from "./strategies/hashing/bcrypt.strategy";
import { SessionCookieService } from "./services/session-cookie.service";
import { TranslatorService } from "./services/translator.service";
import { EventGatewayService } from "./services/event-gateway/event-gateway.service";
import { EventGatewayCommonService } from "./services/event-gateway/event-gateway-common.service";
@Global()
@Module({
    exports: [
        CommonConfig,
        HashingStrategy,
        SessionCookieService,
        TranslatorService,
        EventGatewayService
    ],
    providers: [
        CommonConfig,
        SessionCookieService,
        TranslatorService,
        {
            provide: EventGatewayService,
            useClass: EventGatewayCommonService
        },
        {
            provide: HashingStrategy,
            useClass: BCryptStategy,
        },
    ]
})
export class CommonModule { }