import { JWT_REDIS_STRATEGY_KEY } from "src/authentication/constants/authentication.constant";
import { Injectable } from "@nestjs/common";
import { JwtStrategy } from "./jwt.strategy";
import { JwtInputDto } from "src/authentication/dtos/jwt-input.dto";
import { JwtOutputDto } from "src/authentication/dtos/jwt-output.dto";
import { RedisService } from "src/redis/redis.service";
import { RedisClientType } from "redis";
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from "crypto";

@Injectable()
export class JwtRedisStrategy extends JwtStrategy {

    private redis: RedisClientType;
    constructor(
        private readonly redisService: RedisService,
        private readonly jwtService: JwtService
    ) {
        super();
        this.redis = this.redisService.getClient();
    }

    async generate(jwtInputDto: JwtInputDto): Promise<JwtOutputDto> {
        const refreshTokenId = randomUUID();
    }

    async verify(token: string): Promise<JwtOutputDto> {
        throw new Error("Method not implemented.");
    }

    //TODO: Implement this method
    private async signToken(userId: number, expiresIn: number, payload?: JwtInputDto) {
        // return await this.jwtService.signAsync({
        //     sub: userId,
        //     ...payload
        // }, {
        //     audience: this.jwtConfiguration.audience,
        //     issuer: this.jwtConfiguration.issuer,
        //     secret: this.jwtConfiguration.secret,
        //     expiresIn: expiresIn
        // });
    }

    private async insert(userId: number, tokenId: string): Promise<void> {
        await this.redis.set(this.getKey(userId), tokenId);
    }

    private async validate(userId: number, tokenId: string): Promise<Boolean> {
        const storeId = await this.redis.get(this.getKey(userId));

        if (storeId !== tokenId) {
            throw new Error('Invalid token');
        }

        return true;
    }

    private async invalidate(userId: number): Promise<void> {
        await this.redis.del(this.getKey(userId));
    }

    private getKey(userId: number): string {
        return `${JWT_REDIS_STRATEGY_KEY}${userId}`;
    }

}