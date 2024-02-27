import { AppConfig } from "@app/app.config";
import { Injectable } from "@nestjs/common";
import { CookieOptions, Response, Request } from "express";
import { JwtTokensDto } from "../dtos/jwt-tokens.dto";
import { ActiveUserDto } from "@app/authorization/dto/active-userdto";

/**
 * Service to handle JWT tokens and active user data in cookies for session management.
 * @author yonax73@gmail.com
 * @date 2024-02-07
 */
@Injectable()
export default class JWTCookieService {

    private readonly HTTP_ONLY = true;
    private readonly SECURE = true;
    private readonly ACCESS_TOKEN_COOKIE_KEY = 'YWNjZXNzX3Rva2VuX2Nvb2tpZV9rZXk';
    private readonly REFRESH_TOKEN_COOKIE_KEY = 'cmVmcmVzaF90b2tlbl9jb29raWVfa2V5';
    private readonly ACTIVE_USER_KEY = 'ZWxveC1wcm8tYWN0aXZlLXVzZXI';

    constructor(private readonly appConfig: AppConfig) {
    }

    /**
     * Sets the access token cookie in the response.
     * @param response The HTTP response object.
     * @param token The access token.
     * @param ttl Time-to-live for the cookie.
     */
    setAccessToken(response: Response, token: string, ttl: number): void {
        response.cookie(this.ACCESS_TOKEN_COOKIE_KEY, btoa(token), {
            ...this.getDefaultOptions(ttl)
        });
    }

    /**
     * Sets the refresh token cookie in the response.
     * @param response The HTTP response object.
     * @param token The refresh token.
     * @param ttl Time-to-live for the cookie.
     */
    setRefreshToken(response: Response, token: string, ttl: number): void {
        response.cookie(this.REFRESH_TOKEN_COOKIE_KEY, btoa(token), {
            ...this.getDefaultOptions(ttl)
        });
    }

    /**
     * Sets the active user data in a cookie in the response.
     * @param response The HTTP response object.
     * @param activeUser The active user DTO.
     * @param ttl Time-to-live for the cookie.
     */
    setActiveUser(response: Response, activeUser: ActiveUserDto, ttl: number): void {
        response.cookie(this.ACTIVE_USER_KEY, btoa(JSON.stringify(activeUser)), {
            secure: this.SECURE,
            expires: new Date(Date.now() + ttl * 1000),
            domain: this.appConfig.DOMAIN
        })
    }

    /**
     * Sets both access and refresh tokens in the response.
     * @param response The HTTP response object.
     * @param tokens The JWT tokens DTO.
     */
    setTokens(response: Response, tokens: JwtTokensDto): void {
        this.setAccessToken(response, tokens.accessToken, tokens.accessTokenTTL);
        this.setRefreshToken(response, tokens.refreshToken, tokens.refreshTokenTTL);
    }

    /**
     * Creates a new session with tokens and an active user in cookies.
     * @param response The HTTP response object.
     * @param tokens The JWT tokens DTO.
     * @param activeUser The active user DTO.
     */
    createSession(response: Response, tokens: JwtTokensDto, activeUser: ActiveUserDto): void {
        this.setTokens(response, tokens);
        this.setActiveUser(response, activeUser, tokens.accessTokenTTL);
    }

    /**
     * Rehydrates a session with tokens and an active user in cookies.
     * @param response The HTTP response object.
     * @param tokens The JWT tokens DTO.
     * @param activeUser The active user DTO.
     */
    hydratateSession(response: Response, tokens: JwtTokensDto, activeUser: ActiveUserDto): void {
        this.createSession(response, tokens, activeUser);
    }

    /**
     * Retrieves the access token from the request cookies.
     * @param request The HTTP request object.
     * @returns The access token string.
     */
    getAccessToken(request: Request): string {
        return this.getCookie(request, this.ACCESS_TOKEN_COOKIE_KEY);
    }

    /**
     * Retrieves the refresh token from the request cookies.
     * @param request The HTTP request object.
     * @returns The refresh token string.
     */
    getRefreshToken(request: Request): string {
        return this.getCookie(request, this.REFRESH_TOKEN_COOKIE_KEY);
    }

    /**
     * Retrieves a cookie value from the request cookies.
     * @param request The HTTP request object.
     * @param key The cookie key.
     * @returns The decoded cookie value.
     */
    getCookie(request: Request, key: string): string {
        const value = request.cookies[key];
        if (!value) {
            return null;
        }
        return atob(value);
    }

    /**
     * Returns default cookie options.
     * @param ttl Time-to-live for the cookie.
     * @returns CookieOptions object with default options.
     */
    private getDefaultOptions(ttl: number): CookieOptions {
        return {
            httpOnly: this.HTTP_ONLY,
            secure: this.SECURE,
            expires: new Date(Date.now() + ttl * 1000),
            domain: this.appConfig.DOMAIN
        };
    }

}