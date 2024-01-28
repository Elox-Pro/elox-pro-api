import { Module } from '@nestjs/common';
import { EmailConfig } from './email.config';

@Module({
    providers: [
        EmailConfig
    ]
})
export class EmailModule { }
