import { Module } from '@nestjs/common';
import { BCryptService } from '../authentication/services/bcrypt.service';
import { HashingService } from '../authentication/services/hashing.service';
@Module({
    providers: [
        {
            provide: HashingService,
            useClass: BCryptService,
        },
    ]
})
export class AuthenticationModule { }
