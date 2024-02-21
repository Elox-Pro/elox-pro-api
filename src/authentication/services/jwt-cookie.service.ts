import { AppConfig } from "@app/app.config";
import { Injectable } from "@nestjs/common";
import { CookieOptions, Response, Request } from "express";
import { JwtTokensDto } from "../dtos/jwt-tokens.dto";

@Injectable()
export default class JWTCookieService {

    private readonly HTTP_ONLY = true;
    private readonly SECURE = true;
    private readonly ACCESS_TOKEN_COOKIE_KEY = 'YWNjZXNzX3Rva2VuX2Nvb2tpZV9rZXk';
    private readonly REFRESH_TOKEN_COOKIE_KEY = 'cmVmcmVzaF90b2tlbl9jb29raWVfa2V5';

    constructor(private readonly appConfig: AppConfig) {
    }

    setAccessToken(response: Response, token: string, ttl: number): void {
        response.cookie(this.ACCESS_TOKEN_COOKIE_KEY, btoa(token), {
            ...this.getDefaultOptions(ttl)
        });
    }

    setRefreshToken(response: Response, token: string, ttl: number): void {
        response.cookie(this.REFRESH_TOKEN_COOKIE_KEY, btoa(token), {
            ...this.getDefaultOptions(ttl)
        });
    }

    setTokens(response: Response, tokens: JwtTokensDto): void {
        this.setAccessToken(response, tokens.accessToken, tokens.accessTokenTTL);
        this.setRefreshToken(response, tokens.refreshToken, tokens.refreshTokenTTL);
    }

    getAccessToken(request: Request): string {
        return this.getCookie(request, this.ACCESS_TOKEN_COOKIE_KEY);
    }

    getRefreshToken(request: Request): string {
        return this.getCookie(request, this.REFRESH_TOKEN_COOKIE_KEY);
    }

    getCookie(request: Request, key: string): string {
        const value = request.cookies[key];
        if (!value) {
            return null;
        }
        return atob(value);
    }

    private getDefaultOptions(ttl: number): CookieOptions {
        return {
            httpOnly: this.HTTP_ONLY,
            secure: this.SECURE,
            expires: new Date(Date.now() + ttl * 1000),
            domain: this.appConfig.DOMAIN
        };
    }

}