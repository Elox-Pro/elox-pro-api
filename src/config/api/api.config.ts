import { Injectable } from "@nestjs/common";

@Injectable()
export class ApiConfig {
    public readonly PORT = parseInt(process.env.API_PORT || '3000');
}