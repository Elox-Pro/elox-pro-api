import { Injectable } from "@nestjs/common";

@Injectable()
export class AppConfig {
    public readonly PORT = parseInt(process.env.APP_PORT || '3000');
    public readonly ENVIRONMENT = process.env.ENVIRONMENT || 'development';
}