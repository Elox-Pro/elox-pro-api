import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtCookieService } from "../services/jwt-cookie.service";
import { USER_REQUEST_KEY } from "../../authentication/constants/authentication.constants";
import { JwtStrategy } from "../strategies/jwt.strategy";
import { JwtAccessPayloadDto } from "../dtos/jwt/jwt-access-payload.dto";
import { RefreshTokenUC } from "../usecases/refresh-token.uc";
import { RefreshTokenRequestDto } from "../dtos/refresh-token/refresh-token.request.dto";
import { JwtConfig } from "../config/jwt.config";
import { ActiveUserDto } from "@app/authorization/dto/active-user.dto";

/**
 * Guard to check JWT cookies for authentication and refresh tokens for token renewal.
 * @author Yonatan A Quintero R
 * @date 2024-02-07
 */
@Injectable()
export class JwtCookiesGuard implements CanActivate {

    private logger = new Logger(JwtCookiesGuard.name);

    constructor(
        private readonly jwtCookieService: JwtCookieService,
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
            // Extract the request and response objects from the ExecutionContext
            const request = context.switchToHttp().getRequest();
            const response = context.switchToHttp().getResponse();

            // Retrieve the access token from the request using the JwtCookieService
            const accessToken = this.jwtCookieService.getAccessToken(request);

            // Check if the access token is missing
            if (!accessToken) {
                this.logger.error('Access token not found');
                this.jwtCookieService.deleteSession(response);
                throw new UnauthorizedException();
            }

            // Verify the access token and obtain the payload
            let payload = await this.jwtStrategy.verify<JwtAccessPayloadDto>(accessToken);

            // Calculate the buffer time based on the JWT configuration
            const bufferTime = this.jwtConfig.BUFFER_TIME * 1000;

            // Check if the access token is about to expire
            if ((payload.exp * 1000) <= Date.now() + bufferTime) {
                // Retrieve the refresh token from the request using the JwtCookieService
                const refreshToken = this.jwtCookieService.getRefreshToken(request);

                // Check if the refresh token is missing
                if (!refreshToken) {
                    this.logger.error('Refresh token not found');
                    throw new UnauthorizedException();
                }

                // Execute the refresh token use case to obtain new tokens
                const { tokens } = await this.refreshTokenUC.execute(new RefreshTokenRequestDto(refreshToken));

                // Verify the new access token and update the payload
                payload = await this.jwtStrategy.verify<JwtAccessPayloadDto>(tokens.accessToken);

                // Update the session with the new tokens and active user information
                this.jwtCookieService.hydratateSession(
                    response,
                    tokens,
                    new ActiveUserDto(payload.username, payload.role, payload.lang, true)
                );
            }

            // Set the payload in the request object for downstream processing
            request[USER_REQUEST_KEY] = payload;

            return true; // Authentication succeeded

        } catch (error) {
            // Log and throw an UnauthorizedException if token verification fails
            this.logger.error('Invalid token');
            throw new UnauthorizedException();
        }
    }
}
