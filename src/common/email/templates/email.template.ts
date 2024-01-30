import path from "path";
import { EmailAddressDTO } from "../dtos/email-address.dto";
import { EmailSender } from "../senders/email.sender";

export abstract class EmailTemplate {

    protected readonly noReply = new EmailAddressDTO('Elox Pro', 'master@sourcelatam.tech');
    protected readonly defaultParams = new Map<string, string>([
        ['site', 'https://sourcelatam.tech'],
        ['logo', 'https://i.imgur.com/GWb1S6p.png'],
        ['companyName', 'Elox Pro'],
        ['companyAddress', 'Sir Matt Busby Way, Old Trafford, Stretford, Manchester M16 0RA, United Kingdom.']
    ]);

    constructor(protected readonly sender: EmailSender) {
    }

    abstract send(to: EmailAddressDTO, params: Map<string, string>): Promise<Boolean>;

    protected buildPath(filePath: string) {
        return path.resolve(
            process.cwd(),
            'common/email/resources/ejs/',
            filePath
        );
    };
}