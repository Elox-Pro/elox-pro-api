import { Module } from '@nestjs/common';
import { BCryptService } from 'src/common/hashing/bcrypt.service/bcrypt.service';
import { HashingService } from 'src/common/hashing/hashing.service';
@Module({
    providers: [
        {
            provide: HashingService,
            useClass: BCryptService,
        },
    ]
})
export class AuthenticationModule { }
