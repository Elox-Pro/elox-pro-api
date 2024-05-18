import { RequestLang } from "@app/common/enums/request-lang.enum";
import { EmailAddressDto } from "../dtos/email-address.dto";
import { EmailDTO } from "../dtos/email.dto";
import { EmailSender } from "../senders/email.sender";
import { EmailTemplate } from "./email.template";
import { formatTTL } from "@app/common/helpers/format-ttl.helper";

export class TfaEmailTemplate extends EmailTemplate {

    private readonly subjects = new Map<RequestLang, string>([
        [RequestLang.EN, 'Second Factor Authentication'],
        [RequestLang.ES, 'Segundo factor de autenticación'],
    ]);

    private readonly filePaths = new Map<RequestLang, string>([
        [RequestLang.EN, 'tfa/en/tfa.template.ejs'],
        [RequestLang.ES, 'tfa/es/tfa.template.ejs']
    ]);

    constructor(readonly sender: EmailSender) {
        super(sender);
    }

    async send(to: EmailAddressDto, params: Map<string, string>): Promise<Boolean> {

        if (!params.get("code")) {
            throw new Error("Code not found in params");
        }

        const lang = params.get("lang") as RequestLang;
        if (!lang) {
            throw new Error("Language not found in params");
        }

        try {
            params.set("ttlFormatted", formatTTL(parseInt(params.get("ttl")), lang));

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