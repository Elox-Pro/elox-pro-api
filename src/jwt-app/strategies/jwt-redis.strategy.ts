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

/**
 * JWT Redis Strategy for handling JWT token generation, verification,
 * refresh token management, and storage in Redis.
 *
 * @author Yonatan A Quintero R
 * @update 2024-04-12
 */
@Injectable()
export class JwtRedisStrategy extends JwtStrategy {

    constructor(
        private readonly redis: RedisService,
        private readonly jwtService: JwtService,
        private readonly config: JwtConfig
    ) {
        super();
    }

    /**
    * Generates JWT access and refresh tokens for the given payload.
    *
    * @param payload The JWT access payload containing user data.
    * @returns Promise with JWT tokens and TTL values.
    */
    async generate(payload: JwtAccessPayloadDto): Promise<JwtTokensDto> {
        // Generate a random refresh token ID and extract the subject from the payload
        const refreshTokenId = randomUUID();
        const sub = payload.sub;

        // Generate access token and refresh token asynchronously
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(sub, payload),
            this.generateRefreshToken(sub, { refreshTokenId, sub })
        ]);

        // Store the refresh token in Redis and return JWT tokens with TTL values
        await this.insert(sub, refreshTokenId);

        return new JwtTokensDto(
            accessToken,
            refreshToken,
            this.config.ACCESS_TOKEN_TTL,
            this.config.REFRESH_TOKEN_TTL
        );
    }

    /**
     * Verifies the validity of a JWT token.
     *
     * @param token The JWT token to verify.
     * @returns Promise with the verified payload.
     */
    async verify<T extends JwtAccessPayloadDto | JwtRefreshPayloadDto>(token: string): Promise<T> {
        // Verify the JWT token using the JWT service and return the payload
        const payload: T = await this.jwtService.verifyAsync(token, {
            audience: this.config.AUDIENCE,
            issuer: this.config.ISSUER,
            secret: this.config.SECRET,
        });
        return payload;
    }

    /**
    * Validates the refresh token and invalidates it after validation.
    *
    * @param payload The JWT refresh payload containing user and token data.
    * @returns Promise indicating if the refresh token is validated and invalidated.
    */
    async validateRefreshToken(payload: JwtRefreshPayloadDto): Promise<Boolean> {
        // Validate the refresh token against the stored ID in Redis and invalidate it
        if (!(await this.validate(payload.sub, payload.refreshTokenId))) {
            throw new Error('Refresh token is not valid');
        }

        await this.invalidate(payload.sub);
        return true;
    }

    /**
     * Generates a JWT access token with the given payload.
     *
     * @param sub The subject of the token (e.g., user ID).
     * @param payload The JWT access payload.
     * @returns Promise with the signed JWT access token.
     */
    private async generateAccessToken(sub: string, payload: JwtAccessPayloadDto): Promise<string> {
        // Sign and return an access token with the specified expiration time
        return await this.signToken(sub, this.config.ACCESS_TOKEN_TTL, payload);
    }

    /**
     * Generates a JWT refresh token with the given payload.
     *
     * @param sub The subject of the token (e.g., user ID).
     * @param payload The JWT refresh payload.
     * @returns Promise with the signed JWT refresh token.
     */
    private async generateRefreshToken(sub: string, payload: JwtRefreshPayloadDto): Promise<string> {
        // Sign and return a refresh token with the specified expiration time
        return await this.signToken(sub, this.config.REFRESH_TOKEN_TTL, payload);
    }

    /**
     * Signs a token with the provided payload and expiration time.
     *
     * @param sub The subject of the token (e.g., user ID).
     * @param expiresIn Token expiration time in seconds.
     * @param payload The JWT payload to sign.
     * @returns Promise with the signed token.
     */
    private async signToken<T>(sub: string, expiresIn: number, payload: T): Promise<string> {
        // Sign a JWT token using the JWT service with audience, issuer, secret, and expiration
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

    /**
     * Inserts the refresh token into Redis for validation.
     *
     * @param sub The subject of the token (e.g., user ID).
     * @param tokenId The ID of the refresh token.
     * @returns Promise indicating successful insertion.
     */
    private async insert(sub: string, tokenId: string): Promise<void> {
        // Store the refresh token ID in Redis with the user's key
        await this.redis.getClient().set(this.getKey(sub), tokenId);
    }

    /**
     * Validates the refresh token against the stored token ID.
     *
     * @param sub The subject of the token (e.g., user ID).
     * @param tokenId The ID of the refresh token.
     * @returns Promise indicating if the refresh token is valid.
     * @throws {InvalidateRefreshTokenError} If the refresh token is invalid.
     */
    private async validate(sub: string, tokenId: string): Promise<Boolean> {
        // Retrieve the stored refresh token ID from Redis and validate against the provided ID
        const storeId = await this.redis.getClient().get(this.getKey(sub));

        if (storeId !== tokenId) {
            throw new InvalidateRefreshTokenError();
        }

        return true;
    }

    /**
     * Invalidates the refresh token stored in Redis.
     *
     * @param sub The subject of the token (e.g., user ID).
     * @returns Promise indicating successful invalidation.
     */
    private async invalidate(sub: string): Promise<void> {
        // Delete the stored refresh token ID from Redis upon invalidation
        await this.redis.getClient().del(this.getKey(sub));
    }

    /**
     * Generates the Redis key for storing refresh token IDs.
     *
     * @param sub The subject of the token (e.g., user ID).
     * @returns The Redis key for the given subject.
     */
    private getKey(sub: string): string {
        // Generate a unique key for the user's refresh token in Redis
        return `${JWT_REDIS_STRATEGY_KEY}${sub}`;
    }

}