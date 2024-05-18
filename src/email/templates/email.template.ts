import * as path from "path";
import { EmailAddressDto } from "../dtos/email-address.dto";
import { EmailSender } from "../senders/email.sender";

export abstract class EmailTemplate {

    protected readonly noReply = new EmailAddressDto('master@sourcelatam.tech', 'Elox Pro');
    protected readonly defaultParams = new Map<string, string>([
        ['site', 'https://sourcelatam.tech'],
        ['logo', 'https://i.imgur.com/cYfL1Ut.png'],
        ['companyName', 'Elox Pro'],
        ['companyAddress', 'Sir Matt Busby Way, Old Trafford, Stretford, Manchester M16 0RA, United Kingdom.']
    ]);

    constructor(protected readonly sender: EmailSender) {
    }

    abstract send(to: EmailAddressDto, params: Map<string, string>): Promise<Boolean>;

    protected buildPath(filePath: string) {
        return path.resolve(
            process.cwd(),
            'src/email/resources/ejs/',
            filePath
        );
    };
}