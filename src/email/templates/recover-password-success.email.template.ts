import { RequestLang } from "@app/common/enums/request-lang.enum";
import { EmailAddressDto } from "../dtos/email-address.dto";
import { EmailDTO } from "../dtos/email.dto";
import { EmailSender } from "../senders/email.sender";
import { EmailTemplate } from "./email.template";

/**
 * Email template for sending a recovery password success email.
 * Extends the base EmailTemplate class.
 * @author Yonatan A Quintero R
 * @date 04/01/2024
 */
export class RecoverPasswordSuccessEmailTemplate extends EmailTemplate {

    private readonly subjects = new Map<RequestLang, string>([
        [RequestLang.EN, 'Password Recovery Successful'],
        [RequestLang.ES, 'Recuperación de contraseña exitosa'],
    ]);

    private readonly filePaths = new Map<RequestLang, string>([
        [RequestLang.EN, 'recover-password-success/en/recover-password-success.template.ejs'],
        [RequestLang.ES, 'recover-password-success/es/recover-password-success.template.ejs']
    ]);

    constructor(readonly sender: EmailSender) {
        super(sender);
    }

    /**
     * Sends a recovery password success email.
     * @param to The recipient's email address.
     * @param params Additional parameters for the email template.
     * @returns A promise resolving to true if the email is sent successfully.
     * @throws Error if the username is not found in the params.
     */
    async send(to: EmailAddressDto, params: Map<string, string>): Promise<Boolean> {

        if (!params.get("username")) {
            throw new Error("Username not found in params");
        }

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