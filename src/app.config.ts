import { Injectable } from "@nestjs/common";

@Injectable()
export class AppConfig {
    public readonly PORT = parseInt(process.env.APP_PORT || '3000');
    public readonly ENVIRONMENT = process.env.ENVIRONMENT || 'development';
    public readonly WEB_CLIENT_ORIGIN = process.env.WEB_CLIENT_ORIGIN || 'http://localhost:3001'
}