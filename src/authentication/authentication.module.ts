import { Module } from '@nestjs/common';
import { BCryptService } from '../authentication/services/bcrypt.service';
import { HashingService } from '../authentication/services/hashing.service';
import { EmailTfa } from './strategies/tfa/email-tfa.strategy';
import { TfaFactory } from './factories/tfa.factory';
@Module({
    providers: [
        {
            provide: HashingService,
            useClass: BCryptService,
        },
        EmailTfa,
        TfaFactory
    ]
})
export class AuthenticationModule { }
