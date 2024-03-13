import { Injectable } from "@nestjs/common";

@Injectable()
export class AppConfig {
    public readonly PORT = parseInt(process.env.APP_PORT || '3000');
    public readonly ENVIRONMENT = process.env.ENVIRONMENT || 'development';
    public readonly WEB_CLIENT_ORIGIN = process.env.WEB_CLIENT_ORIGIN || 'http://localhost:3001'
    public readonly DOMAIN = process.env.DOMAIN || '.localhost'
    public readonly GOOGLE_RECAPTCHA_SECRET_KEY = process.env.GOOGLE_RECAPTCHA_SECRET_KEY || null;
}