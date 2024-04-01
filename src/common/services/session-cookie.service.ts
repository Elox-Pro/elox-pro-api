import { Injectable } from "@nestjs/common";
import { CommonConfig } from "../config/common.config";
import { Response, Request } from "express";

/**
 * Service to handle session in cookies for temporary sessions with a short expiration time.
 * @author yonax73@gmail.com
 * @date 2024-04-01
 */
@Injectable()
export class SessionCookieService {

    private readonly HTTP_ONLY = true;
    private readonly SECURE = true;
    private readonly KEY = '4969696F6E2D636F6F6B69652D7365727669636573';

    constructor(private readonly config: CommonConfig) {
    }

    create(response: Response, token: string, ttl: number): void {
        response.cookie(this.KEY, btoa(token), {
            httpOnly: this.HTTP_ONLY,
            secure: this.SECURE,
            expires: new Date(Date.now() + ttl * 1000),
            domain: this.config.DOMAIN
        });
    }

    get(request: Request): string {
        const value = request.cookies[this.KEY];
        if (!value) {
            return null;
        }
        return atob(value);
    }

    delete(response: Response): void {
        response.clearCookie(this.KEY, {
            domain: this.config.DOMAIN
        });
    }
}