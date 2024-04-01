import { UserLang } from "@prisma/client";
import { EmailAddressDto } from "../dtos/email-address.dto";
import { EmailDTO } from "../dtos/email.dto";
import { EmailSender } from "../senders/email.sender";
import { EmailTemplate } from "./email.template";

export class RecoverPasswordSuccessEmailTemplate extends EmailTemplate {

    private readonly subjects = new Map<UserLang, string>([
        [UserLang.EN, 'Password Recovery Successful'],
        [UserLang.ES, 'Recuperación de contraseña exitosa'],
    ]);

    private readonly filePaths = new Map<UserLang, string>([
        [UserLang.EN, 'recover-password-success/en/recover-password-success.ejs'],
        [UserLang.ES, 'recover-password-success/es/recover-password-success.ejs']
    ]);

    constructor(readonly sender: EmailSender) {
        super(sender);
    }

    async send(to: EmailAddressDto, params: Map<string, string>): Promise<Boolean> {

        if (!params.get("username")) {
            throw new Error("Username not found in params");
        }

        const lang = params.get("lang") as UserLang || UserLang.EN;

        return await this.sender.send(new EmailDTO(
            this.noReply,
            to,
            this.subjects.get(lang),
            this.buildPath(this.filePaths.get(lang)),
            new Map<string, string>([...params, ...this.defaultParams])
        ));

    }
}