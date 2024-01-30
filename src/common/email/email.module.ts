import { Module } from '@nestjs/common';
import { EmailConfig } from './email.config';
import { EmailSender } from './senders/email.sender';
import { NodeMailerSender } from './senders/node-mailer.sender';
import { EJSEmailRender } from './renders/ejs-email.render';
import { EmailRender } from './renders/email.render';

@Module({
    providers: [
        {
            provide: EmailSender,
            useClass: NodeMailerSender
        },
        {
            provide: EmailRender,
            useClass: EJSEmailRender
        },
        EmailConfig,
    ]
})
export class EmailModule { }
