import { Logger } from '@nestjs/common';
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";
import { RedisConfig } from "./redis.config";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {

    private readonly logger = new Logger(RedisService.name);
    private client: RedisClientType;

    constructor(private readonly config: RedisConfig) { }

    getClient(): RedisClientType {
        return this.client;
    }

    async onModuleInit() {
        this.client = createClient({
            url: this.config.URL
        });

        await this.client.connect();

        this.client.on('connect', () => {
            this.logger.log('Client connected to redis...')
        })

        this.client.on('ready', () => {
            this.logger.log('Client connected to redis and ready to use')
        });

        this.client.on('error', (error) => {
            this.logger.error(error.message)
        });

        this.client.on('end', () => {
            this.logger.log('Client disconnected from redis')
        });

    }

    async onModuleDestroy() {
        await this.client.quit();
    }
}