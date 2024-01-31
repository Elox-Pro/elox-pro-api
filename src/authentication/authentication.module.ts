import { Module } from '@nestjs/common';
import { BCryptStategy } from '../authentication/strategies/hashing/bcrypt.strategy';
import { HashingStrategy } from '../authentication/strategies/hashing/hashing.strategy';
import { EmailTfaStrategy } from './strategies/tfa/email-tfa.strategy';
import { TfaFactory } from './factories/tfa.factory';
import { EmailFactory } from 'src/common/email/factories/email.factory';
import { AuthenticationController } from './controllers/authentication.controller';
import { LoginUC } from './usecases/login.uc';
import { RedisService } from 'src/redis/redis.service';
import { EmailSender } from 'src/common/email/senders/email.sender';
import { NodeMailerSender } from 'src/common/email/senders/node-mailer.sender';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [
        AuthenticationController
    ],
    providers: [
        EmailTfaStrategy,
        TfaFactory,
        EmailFactory,
        LoginUC,
        RedisService,
        PrismaService,
        {
            provide: EmailSender,
            useClass: NodeMailerSender
        },
        {
            provide: HashingStrategy,
            useClass: BCryptStategy,
        }
    ]
})
export class AuthenticationModule { }
