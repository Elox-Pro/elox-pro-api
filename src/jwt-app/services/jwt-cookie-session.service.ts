import { ActiveUserDto } from "@app/authorization/dto/active-user.dto";
import { JwtAccessPayloadDto } from "@app/jwt-app/dtos/jwt/jwt-access-payload.dto";
import { JwtCookieService } from "@app/jwt-app/services/jwt-cookie.service";
import { JwtStrategy } from "@app/jwt-app/strategies/jwt.strategy";
import { Injectable, Logger } from "@nestjs/common";
import { User } from "@prisma/client";
import { Response } from "express";

/**
 * A service for creating a session for a user using JWT tokens and a JWT cookie service.
 * This service is responsible for generating tokens and creating a session cookie.
 * @author Yonatan A Quintero R
 * @date 2024-04-03
 */
@Injectable()
export class JwtCookieSessionService {

    private readonly logger = new Logger(JwtCookieSessionService.name);

    constructor(
        private readonly jwtStrategy: JwtStrategy,
        private readonly jwtCookieService: JwtCookieService
    ) { }

    /**
     * Creates a session for the user.
     * Generates JWT tokens, creates an active user object, and sets the session cookie.
     * @param response The Express Response object for setting cookies.
     * @param user The User object representing the user.
     * @param reqIp The user request ip address.
     */
    async create(response: Response, user: User): Promise<void> {
        try {

            // Generate JWT tokens with the user's username and role as payload
            const payload = new JwtAccessPayloadDto(
                user.username, user.role, user.avatarUrl, true
            );

            const tokens = await this.jwtStrategy.generate(payload);

            // Create an active user object with the user's details
            const activeUser = new ActiveUserDto(
                payload.username,
                payload.role,
                user.avatarUrl,
                true
            );

            // Create a session using the JWT cookie service
            this.jwtCookieService.createSession(response, tokens, activeUser);
        } catch (error) {
            // Log and rethrow any errors that occur during session creation
            this.logger.error(JSON.stringify(error));
            throw error;
        }
    }
}