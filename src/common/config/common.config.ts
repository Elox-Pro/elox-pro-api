import { Injectable } from "@nestjs/common";
import { Enviroment } from "../enums/enviroment.enum";

@Injectable()
export class CommonConfig {
    public readonly PORT = parseInt(process.env.APP_PORT || '3000');
    public readonly ENVIRONMENT = process.env.ENVIRONMENT || Enviroment.DEVELOPMENT;
    public readonly WEB_CLIENT_ORIGIN = process.env.WEB_CLIENT_ORIGIN || 'http://localhost:3001'
    public readonly DOMAIN = process.env.DOMAIN || '.localhost'
    public readonly GOOGLE_RECAPTCHA_SECRET_KEY = process.env.GOOGLE_RECAPTCHA_SECRET_KEY || null;
    public readonly WS_PORT = parseInt(process.env.WS_PORT || '3001');
}