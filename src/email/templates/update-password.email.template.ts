import { UserLang } from "@prisma/client";
import { EmailAddressDto } from "../dtos/email-address.dto";
import { EmailDTO } from "../dtos/email.dto";
import { EmailSender } from "../senders/email.sender";
import { EmailTemplate } from "./email.template";

export class UpdatePasswordTemplate extends EmailTemplate {

    private readonly subjects = new Map<UserLang, string>([
        [UserLang.EN, 'Your password has been updated'],
        [UserLang.ES, 'Su contraseña ha sido actualizado'],
    ]);

    private readonly filePaths = new Map<UserLang, string>([
        [UserLang.EN, 'update-password/en/update-password.template.ejs'],
        [UserLang.ES, 'update-password/es/update-password.template.ejs']
    ]);

    constructor(readonly sender: EmailSender) {
        super(sender);
    }

    async send(to: EmailAddressDto, params: Map<string, string>): Promise<Boolean> {

        try {
            const lang = params.get("lang") as UserLang || UserLang.EN;
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