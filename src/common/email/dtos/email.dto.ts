import { EmailAddressDto } from "./email-address.dto";

export class EmailDTO {

    constructor(
        readonly from: EmailAddressDto,
        readonly to: EmailAddressDto,
        readonly subject: string,
        readonly filePath: string,
        readonly params: Map<string, string>
    ) { }

}