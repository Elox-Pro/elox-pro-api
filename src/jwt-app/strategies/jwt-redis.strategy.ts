import { JWT_REDIS_STRATEGY_KEY } from "../constants/jwt.constants";
import { Injectable } from "@nestjs/common";
import { JwtStrategy } from "./jwt.strategy";
import { RedisService } from "redis/redis.service";
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from "crypto";
import { JwtConfig } from "@app/jwt-app/config/jwt.config";
import { JwtAccessPayloadDto } from "../dtos/jwt/jwt-access-payload.dto";
import { JwtTokensDto } from "../dtos/jwt/jwt-tokens.dto";
import { JwtRefreshPayloadDto } from "../dtos/jwt/jwt-refresh-payload.dto";
import { InvalidateRefreshTokenError } from "@app/jwt-app/errors/invalidate-refresh-token.error";

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
        const sub = payload.sub;

        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(sub, payload),
            this.generateRefreshToken(sub, { refreshTokenId, sub })
        ]);

        await this.insert(sub, refreshTokenId);

        return new JwtTokensDto(
            accessToken,
            refreshToken,
            this.config.ACCESS_TOKEN_TTL,
            this.config.REFRESH_TOKEN_TTL
        );
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

        if (!(await this.validate(payload.sub, payload.refreshTokenId))) {
            throw new Error('Refresh token is not valid');
        }

        await this.invalidate(payload.sub);
        return true;
    }

    private async generateAccessToken(
        sub: string, payload: JwtAccessPayloadDto
    ): Promise<string> {
        return await this.signToken(sub, this.config.ACCESS_TOKEN_TTL, payload);
    }

    private async generateRefreshToken(
        sub: string, payload: JwtRefreshPayloadDto
    ): Promise<string> {
        return await this.signToken(sub, this.config.REFRESH_TOKEN_TTL, payload);
    }


    private async signToken<T>(sub: string, expiresIn: number, payload: T): Promise<string> {
        return await this.jwtService.signAsync({
            sub: sub,
            ...payload
        }, {
            audience: this.config.AUDIENCE,
            issuer: this.config.ISSUER,
            secret: this.config.SECRET,
            expiresIn: expiresIn
        });
    }

    private async insert(sub: string, tokenId: string): Promise<void> {
        await this.redis.getClient().set(this.getKey(sub), tokenId);
    }

    private async validate(sub: string, tokenId: string): Promise<Boolean> {
        const storeId = await this.redis.getClient().get(this.getKey(sub));

        if (storeId !== tokenId) {
            throw new InvalidateRefreshTokenError();
        }

        return true;
    }

    private async invalidate(sub: string): Promise<void> {
        await this.redis.getClient().del(this.getKey(sub));
    }

    private getKey(sub: string): string {
        return `${JWT_REDIS_STRATEGY_KEY}${sub}`;
    }

}