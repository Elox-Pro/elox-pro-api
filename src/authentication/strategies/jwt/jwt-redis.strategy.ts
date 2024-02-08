import { JWT_REDIS_STRATEGY_KEY } from "authentication/constants/authentication.constants";
import { Injectable } from "@nestjs/common";
import { JwtStrategy } from "./jwt.strategy";
import { RedisService } from "redis/redis.service";
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from "crypto";
import { JwtConfig } from "authentication/config/jwt.config";
import { JwtAccessPayloadDto } from "@app/authentication/dtos/jwt-access-payload.dto";
import { JwtTokensDto } from "@app/authentication/dtos/jwt-tokens.dto";
import { JwtRefreshPayloadDto } from "@app/authentication/dtos/jwt-refresh-payload.dto";
import { InvalidateRefreshTokenError } from "@app/authentication/errors/invalidate-refresh-token.error";

@Injectable()
export class JwtRedisStrategy extends JwtStrategy {

    constructor(
        private readonly redis: RedisService,
        private readonly jwtService: JwtService,
        private readonly config: JwtConfig
    ) {
        super();
    }

    async generate(payload: JwtAccessPayloadDto): Promise<JwtTokensDto> {
        const refreshTokenId = randomUUID();
        const userId = payload.userId;

        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(userId, payload),
            this.generateRefreshToken(userId, { refreshTokenId, userId })
        ]);
        await this.insert(userId, refreshTokenId);

        return new JwtTokensDto(accessToken, refreshToken);
    }

    async verify<T extends JwtAccessPayloadDto | JwtRefreshPayloadDto>(token: string): Promise<T> {
        const payload: T = await this.jwtService.verifyAsync(token, {
            audience: this.config.AUDIENCE,
            issuer: this.config.ISSUER,
            secret: this.config.SECRET,
        });
        return payload;
    }

    async validateRefreshToken(payload: JwtRefreshPayloadDto): Promise<Boolean> {

        if (!(await this.validate(payload.userId, payload.refreshTokenId))) {
            throw new Error('Refresh token is not valid');
        }

        await this.invalidate(payload.userId);
        return true;
    }

    private async generateAccessToken(
        userId: number, payload: JwtAccessPayloadDto
    ): Promise<string> {
        return await this.signToken(userId, this.config.ACCESS_TOKEN_TTL, payload);
    }

    private async generateRefreshToken(
        userId: number, payload: JwtRefreshPayloadDto
    ): Promise<string> {
        return await this.signToken(userId, this.config.REFRESH_TOKEN_TTL, payload);
    }


    private async signToken<T>(userId: number, expiresIn: number, payload: T): Promise<string> {
        return await this.jwtService.signAsync({
            sub: userId,
            ...payload
        }, {
            audience: this.config.AUDIENCE,
            issuer: this.config.ISSUER,
            secret: this.config.SECRET,
            expiresIn: expiresIn
        });
    }

    private async insert(userId: number, tokenId: string): Promise<void> {
        await this.redis.getClient().set(this.getKey(userId), tokenId);
    }

    private async validate(userId: number, tokenId: string): Promise<Boolean> {
        const storeId = await this.redis.getClient().get(this.getKey(userId));

        if (storeId !== tokenId) {
            throw new InvalidateRefreshTokenError();
        }

        return true;
    }

    private async invalidate(userId: number): Promise<void> {
        await this.redis.getClient().del(this.getKey(userId));
    }

    private getKey(userId: number): string {
        return `${JWT_REDIS_STRATEGY_KEY}${userId}`;
    }

}