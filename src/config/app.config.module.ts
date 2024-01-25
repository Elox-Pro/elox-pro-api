import { Module } from '@nestjs/common';
import { ApiConfig } from './api/api.config';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true })
    ],
    providers: [ApiConfig],
})
export class AppConfigModule { }
