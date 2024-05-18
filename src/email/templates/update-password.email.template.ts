import { RequestLang } from "@app/common/enums/request-lang.enum";
import { EmailAddressDto } from "../dtos/email-address.dto";
import { EmailDTO } from "../dtos/email.dto";
import { EmailSender } from "../senders/email.sender";
import { EmailTemplate } from "./email.template";

export class UpdatePasswordTemplate extends EmailTemplate {

    private readonly subjects = new Map<RequestLang, string>([
        [RequestLang.EN, 'Your password has been updated'],
        [RequestLang.ES, 'Su contraseña ha sido actualizado'],
    ]);

    private readonly filePaths = new Map<RequestLang, string>([
        [RequestLang.EN, 'update-password/en/update-password.template.ejs'],
        [RequestLang.ES, 'update-password/es/update-password.template.ejs']
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