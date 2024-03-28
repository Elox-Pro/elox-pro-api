import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtConfig } from "./config/jwt.config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtRedisStrategy } from "./strategies/jwt-redis.strategy";
import { RefreshTokenUC } from "./usecases/refresh-token.uc";
import { AccessTokenGuard } from "./guards/access-token.guard";
import { JwtCookiesGuard } from "./guards/jwt-cookies.guard";
import { JwtCookieService } from "./services/jwt-cookie.service";
import { JwtController } from "./controllers/jwt.controller";

@Module({
    controllers: [
        JwtController
    ],
    exports: [
        AccessTokenGuard,
        JwtCookiesGuard,
        JwtCookieService,
        JwtStrategy,
    ],
    imports: [
        JwtModule
    ],
    providers: [
        AccessTokenGuard,
        JwtConfig,
        JwtCookiesGuard,
        JwtCookieService,
        RefreshTokenUC,
        {
            provide: JwtStrategy,
            useClass: JwtRedisStrategy
        },
    ]
})
export class JwtAppModule { }