import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { RefreshTokenRequestDto } from "../dtos/refresh-token/refresh-token.request.dto";
import { RefreshTokenResponseDto } from "../dtos/refresh-token/refresh-token.response.dto";
import { IUseCase } from "@app/common/usecase/usecase.interface";
import { JwtStrategy } from "../strategies/jwt.strategy";
import { JwtRefreshPayloadDto } from "../dtos/jwt/jwt-refresh-payload.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { JwtAccessPayloadDto } from "../dtos/jwt/jwt-access-payload.dto";
import { InvalidateRefreshTokenError } from "../errors/invalidate-refresh-token.error";

@Injectable()
export class RefreshTokenUC implements IUseCase<RefreshTokenRequestDto, RefreshTokenResponseDto> {

    private readonly logger = new Logger(RefreshTokenUC.name);

    constructor(
        private readonly jwtStrategy: JwtStrategy,
        private readonly prisma: PrismaService
    ) { }

    async execute(data: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {

        const payload = await this.jwtStrategy.verify<JwtRefreshPayloadDto>(data.refreshToken);
        const user = await this.prisma.user.findUnique({
            where: { username: payload.username }
        });

        if (!user) {
            this.logger.error(`User not found: ${payload.username}`);
            throw new UnauthorizedException('error.invalid-credentials');
        }

        try {
            await this.jwtStrategy.validateRefreshToken(payload);
        } catch (error) {

            if (error instanceof InvalidateRefreshTokenError) {

                // Take action: notify the user that their refresh token  might have been stolen?
                this.logger.error(
                    `The refresh token  might have been stolen for user: ${user.username}`
                )

                throw new UnauthorizedException('error.access-denied');
            }

            throw new UnauthorizedException('error.invalid-credentials');
        }

        const tokens = await this.jwtStrategy.generate(
            new JwtAccessPayloadDto(user.username, user.role, data.ipClient),
        );

        return new RefreshTokenResponseDto(tokens);
    }
}