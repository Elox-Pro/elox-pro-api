import { Injectable } from "@nestjs/common";

@Injectable()
export class RedisConfig {
    public readonly URL = process.env.REDIS_URL || 'redis://localhost:6379';
    public readonly PORT = parseInt(process.env.REDIS_PORT) || 6379;
    public readonly HOST = process.env.REDIS_HOST || 'localhost';
    public readonly DB = parseInt(process.env.REDIS_DB) || 0;
}