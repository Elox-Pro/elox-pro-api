import { Global, Module } from '@nestjs/common';
import { EmailConfig } from './email.config';
import { EmailSender } from './senders/email.sender';
import { NodeMailerSender } from './senders/node-mailer.sender';
import { EJSEmailRender } from './renders/ejs-email.render';
import { EmailRender } from './renders/email.render';
import { EmailFactory } from './factories/email.factory';
import { EmailProcessor } from './processors/email.processor';

@Global()
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
        EmailFactory,
        EmailConfig,
        EmailProcessor,
    ],

    exports: [
        EmailFactory
    ]
})
export class EmailModule { }
