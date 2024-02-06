import { Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";
import { RedisConfig } from "./redis.config";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {

    private readonly logger = new Logger(RedisService.name);
    private client: RedisClientType;

    constructor(private readonly config: RedisConfig) {
    }

    onModuleInit() {
        this.init().catch((error) => {
            this.logger.error(`Error trying to connect to the redis client: ${this.config.URL}`);
            this.logger.error(error);
        });
    }

    onModuleDestroy() {
        this.client.quit();
    }

    public getClient(): RedisClientType {
        return this.client;
    }

    private async init(): Promise<void> {
        this.client = createClient({
            url: this.config.URL
        });

        await this.client.connect();

        if (this.client.isReady) {
            this.logger.log(`Redis client is ready`);
        }

        if (this.client.isOpen) {
            this.logger.log(`Redis client is open`);
        }

        this.client.on('connect', () => {
            this.logger.log('Client connected to redis...');
        })

        this.client.on('ready', () => {
            this.logger.log('Client connected to redis and ready to use');
        });

        this.client.on('error', (error) => {
            this.logger.error(error.message);
        });

        this.client.on('end', () => {
            this.logger.log('Client disconnected from redis');
        });
    }

}