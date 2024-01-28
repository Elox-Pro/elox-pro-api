import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailConfig {
    public readonly HOST = process.env.EMAIL_HOST;
    public readonly PORT = parseInt(process.env.EMAIL_PORT || '465');
    public readonly USERNAME = process.env.EMAIL_USERNAME;
    public readonly PASSWORD = process.env.EMAIL_PASSWORD;
    public readonly LOGGER = Boolean(process.env.EMAIL_LOGGER || 'false');

    constructor() {
        if (!this.USERNAME || !this.HOST || !this.PASSWORD) {
            throw new Error('Email configuration is missing');
        }
    }
}