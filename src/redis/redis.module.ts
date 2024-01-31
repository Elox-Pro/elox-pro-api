import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisConfig } from './redis.config';

@Module({
  providers: [
    RedisService,
    RedisConfig
  ]
})
export class RedisModule { }
