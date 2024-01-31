import { Injectable } from "@nestjs/common";

@Injectable()
export class RedisConfig {
    public readonly URL = process.env.REDIS_URL || 'redis://localhost:6379';
}