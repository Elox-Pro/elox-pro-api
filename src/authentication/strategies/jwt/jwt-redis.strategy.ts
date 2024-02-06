import { JWT_REDIS_STRATEGY_KEY } from "authentication/constants/authentication.constants";
import { Injectable } from "@nestjs/common";
import { JwtStrategy } from "./jwt.strategy";
import { JwtInputDto } from "authentication/dtos/jwt-input.dto";
import { JwtOutputDto } from "authentication/dtos/jwt-output.dto";
import { RedisService } from "redis/redis.service";
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from "crypto";
import { JwtConfig } from "authentication/config/jwt.config";


@Injectable()
export class JwtRedisStrategy extends JwtStrategy {

    constructor(
        private readonly redis: RedisService,
        private readonly jwtService: JwtService,
        private readonly config: JwtConfig
    ) {
        super();
    }

    async generate(jwtInputDto: JwtInputDto): Promise<JwtOutputDto> {
        const refreshTokenId = randomUUID();
        const userId = jwtInputDto.userId;

        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(userId, jwtInputDto),
            this.generateRefreshToken(userId, refreshTokenId),
        ]);
        await this.insert(userId, refreshTokenId);

        return new JwtOutputDto(accessToken, refreshToken);
    }

    async verify(token: string): Promise<JwtOutputDto> {
        throw new Error("Method not implemented.");
    }

    private async generateAccessToken(userId: number, jwtInputDto: JwtInputDto): Promise<string> {
        return await this.signToken(userId, this.config.ACCESS_TOKEN_TTL, jwtInputDto);
    }

    private async generateRefreshToken(userId: number, tokenId: string): Promise<string> {
        return await this.signToken(userId, this.config.REFRESH_TOKEN_TTL, { tokenId });
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
            throw new Error('Invalid token');
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