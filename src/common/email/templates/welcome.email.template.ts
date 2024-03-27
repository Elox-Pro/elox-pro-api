import { UserLang } from "@prisma/client";
import { EmailAddressDto } from "../dtos/email-address.dto";
import { EmailDTO } from "../dtos/email.dto";
import { EmailSender } from "../senders/email.sender";
import { EmailTemplate } from "./email.template";

export class WelcomeEmailTemplate extends EmailTemplate {

    private readonly subjects = new Map<UserLang, string>([
        [UserLang.EN, 'Welcome to Elox Pro'],
        [UserLang.ES, 'Bienvenido a Elox Pro'],
    ]);

    private readonly filePaths = new Map<UserLang, string>([
        [UserLang.EN, 'welcome/en/welcome.template.ejs'],
        [UserLang.ES, 'welcome/es/welcome.template.ejs']
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