import { EmailAddressDTO } from "../dtos/email-address.dto";
import { EmailDTO } from "../dtos/email.dto";
import { EmailSender } from "../senders/email.sender";
import { EmailTemplate } from "./email.template";

export class TfaEmailTemplate extends EmailTemplate {

    private readonly filePath = `tfa/tfa.template.en.ejs`;
    private readonly subject: 'Second Factor Authentication';

    constructor(readonly sender: EmailSender) {
        super(sender);
    }

    async send(to: EmailAddressDTO, params: Map<string, string>): Promise<Boolean> {

        if (!params.get("code")) {
            throw new Error("Code not found in params");
        }

        return await this.sender.send(new EmailDTO(
            this.noReply,
            to,
            this.subject,
            this.filePath,
            Object.assign(params, this.defaultParams)
        ));

    }
}