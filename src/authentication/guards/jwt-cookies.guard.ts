import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import JWTCookieService from "../services/jwt-cookie.service";
import { USER_REQUEST_KEY } from "../constants/authentication.constants";
import { JwtStrategy } from "../strategies/jwt/jwt.strategy";
import { JwtAccessPayloadDto } from "../dtos/jwt-access-payload.dto";

@Injectable()
export class JWTCookiesGuard implements CanActivate {

    private logger = new Logger(JWTCookiesGuard.name);

    constructor(
        private readonly jwtCookieService: JWTCookieService,
        private readonly jwtStrategy: JwtStrategy
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const accessToken = this.jwtCookieService.getAccessToken(
                request
            );

            if (!accessToken) {
                this.logger.error('Token not found');
                throw new UnauthorizedException();
            }

            request[USER_REQUEST_KEY] = await this.jwtStrategy.verify<JwtAccessPayloadDto>(
                accessToken
            );

            return true;

        } catch (error) {
            this.logger.error('Invalid token');
            throw new UnauthorizedException();
        }
    }
}