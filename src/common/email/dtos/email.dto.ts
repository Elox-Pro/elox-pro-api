import { EmailAddressDTO } from "./email-address.dto";

export class EmailDTO {

    constructor(
        readonly from: EmailAddressDTO,
        readonly to: EmailAddressDTO,
        readonly subject: string,
        readonly filePath: string,
        readonly params: Map<string, string>
    ) { }

}