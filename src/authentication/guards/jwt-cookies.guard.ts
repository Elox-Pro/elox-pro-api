import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import JWTCookieService from "../services/jwt-cookie.service";
import { USER_REQUEST_KEY } from "../constants/authentication.constants";
import { JwtStrategy } from "../strategies/jwt/jwt.strategy";
import { JwtAccessPayloadDto } from "../dtos/jwt/jwt-access-payload.dto";
import { RefreshTokenUC } from "../usecases/refresh-token.uc";
import { RefreshTokenRequestDto } from "../dtos/refresh-token/refresh-token.request.dto";
import { JwtConfig } from "../config/jwt.config";
import { ActiveUserDto } from "@app/authorization/dto/active-user.dto";

/**
 * Guard to check JWT cookies for authentication and refresh tokens for token renewal.
 * @author yonax73@gmail.com
 * @date 2024-02-07
 */
@Injectable()
export class JWTCookiesGuard implements CanActivate {

    private logger = new Logger(JWTCookiesGuard.name);

    constructor(
        private readonly jwtCookieService: JWTCookieService,
        private readonly jwtStrategy: JwtStrategy,
        private readonly refreshTokenUC: RefreshTokenUC,
        private readonly jwtConfig: JwtConfig,
    ) { }

    /**
     * Checks if the request has valid JWT tokens in cookies and refreshes them if necessary.
     * @param context The execution context.
     * @returns A boolean indicating whether the request is allowed.
     * @throws UnauthorizedException if authentication fails.
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();
            const accessToken = this.jwtCookieService.getAccessToken(request);

            if (!accessToken) {
                this.logger.error('Access token not found');
                throw new UnauthorizedException();
            }

            let payload = await this.jwtStrategy.verify<JwtAccessPayloadDto>(accessToken);

            const bufferTime = this.jwtConfig.BUFFER_TIME * 1000;

            if ((payload.exp * 1000) <= Date.now() + bufferTime) {

                const refreshToken = this.jwtCookieService.getRefreshToken(request);

                if (!refreshToken) {
                    this.logger.error('Refresh token not found');
                    throw new UnauthorizedException();
                }

                const { tokens } = await this.refreshTokenUC.execute(new RefreshTokenRequestDto(refreshToken));

                payload = await this.jwtStrategy.verify<JwtAccessPayloadDto>(tokens.accessToken);

                this.jwtCookieService.hydratateSession(
                    response,
                    tokens,
                    new ActiveUserDto(payload.sub, payload.role, true)
                );
            }

            request[USER_REQUEST_KEY] = payload;

            return true;

        } catch (error) {
            this.logger.error('Invalid token');
            throw new UnauthorizedException();
        }
    }
}
