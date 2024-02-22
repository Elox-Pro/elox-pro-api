import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import JWTCookieService from "../services/jwt-cookie.service";
import { USER_REQUEST_KEY } from "../constants/authentication.constants";
import { JwtStrategy } from "../strategies/jwt/jwt.strategy";
import { JwtAccessPayloadDto } from "../dtos/jwt-access-payload.dto";
import { RefreshTokenUC } from "../usecases/refresh-token.uc";
import { RefreshTokenRequestDto } from "../dtos/refresh-token.request.dto";

@Injectable()
export class JWTCookiesGuard implements CanActivate {

    private logger = new Logger(JWTCookiesGuard.name);

    constructor(
        private readonly jwtCookieService: JWTCookieService,
        private readonly jwtStrategy: JwtStrategy,
        private readonly refreshTokenUC: RefreshTokenUC,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();
            let accessToken = this.jwtCookieService.getAccessToken(
                request
            );
            console.log(1, 'accessToken', accessToken);
            if (!accessToken) {

                const refreshToken = this.jwtCookieService.getRefreshToken(
                    request
                );

                console.log(2, 'refreshToken', refreshToken);

                if (!refreshToken) {
                    this.logger.error('Refresh token not found');
                    throw new UnauthorizedException();
                }

                const refreshTokenResponse = await this.refreshTokenUC.execute(
                    new RefreshTokenRequestDto(refreshToken)
                )

                console.log(3, 'refreshTokenResponse', refreshTokenResponse);

                this.jwtCookieService.setTokens(
                    response,
                    refreshTokenResponse.tokens
                );

                console.log(4, 'jwtCookieService.setTokens');

                accessToken = refreshTokenResponse.tokens.accessToken;

                console.log(5, 'accessToken', accessToken);
            }

            request[USER_REQUEST_KEY] = await this.jwtStrategy.verify<JwtAccessPayloadDto>(
                accessToken
            );

            console.log(6, 'USER_REQUEST_KEY', request[USER_REQUEST_KEY]);

            return true;

        } catch (error) {
            console.log(7, 'error', error);
            this.logger.error('Invalid token');
            throw new UnauthorizedException();
        }
    }
}