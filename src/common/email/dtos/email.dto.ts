import { EmailAddressDTO } from "./email-address.dt";

export class EmailDTO {

    readonly from: EmailAddressDTO;
    readonly to: EmailAddressDTO;
    readonly subject: string;
    readonly text: string;
    readonly html: string;
    readonly params: Map<string, string>;

    constructor(data: Partial<EmailDTO>) {
        Object.assign(this, data);
    }

}