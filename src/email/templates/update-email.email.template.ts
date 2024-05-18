import { RequestLang } from "@app/common/enums/request-lang.enum";
import { EmailAddressDto } from "../dtos/email-address.dto";
import { EmailDTO } from "../dtos/email.dto";
import { EmailSender } from "../senders/email.sender";
import { EmailTemplate } from "./email.template";

export class UpdateEmailTemplate extends EmailTemplate {

    private readonly subjects = new Map<RequestLang, string>([
        [RequestLang.EN, 'Your email address has been updated'],
        [RequestLang.ES, 'Su correo electrónico ha sido actualizado'],
    ]);

    private readonly filePaths = new Map<RequestLang, string>([
        [RequestLang.EN, 'update-email/en/update-email.template.ejs'],
        [RequestLang.ES, 'update-email/es/update-email.template.ejs']
    ]);

    constructor(readonly sender: EmailSender) {
        super(sender);
    }

    async send(to: EmailAddressDto, params: Map<string, string>): Promise<Boolean> {

        const lang = params.get("lang") as RequestLang;
        if (!lang) {
            throw new Error("Language not found in params");
        }

        try {

            return await this.sender.send(new EmailDTO(
                this.noReply,
                to,
                this.subjects.get(lang),
                this.buildPath(this.filePaths.get(lang)),
                new Map<string, string>([...params, ...this.defaultParams])
            ));
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}