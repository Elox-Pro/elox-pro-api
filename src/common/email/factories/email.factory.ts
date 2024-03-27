import { Injectable } from "@nestjs/common";
import { EmailSender } from "../senders/email.sender";
import { EmailType } from "../enums/email-type.enum";
import { EmailTemplate } from "../templates/email.template";
import { TfaEmailTemplate } from "../templates/tfa.email.template";
import { WelcomeEmailTemplate } from "../templates/welcome.email.template";

@Injectable()
export class EmailFactory {

    constructor(private readonly emailSender: EmailSender) {
    }

    public getEmail(type: EmailType): EmailTemplate {

        switch (type) {
            case EmailType.TFA:
                return new TfaEmailTemplate(this.emailSender);
            case EmailType.WELCOME:
                return new WelcomeEmailTemplate(this.emailSender);
            default:
                throw new Error('Invalid email type');
        }
    }

}
