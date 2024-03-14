import * as path from "path";
import { EmailAddressDto } from "../dtos/email-address.dto";
import { EmailSender } from "../senders/email.sender";

const theme: Map<string, string> = new Map([
    ['themePrimaryBackground', '#e6e9eb'],
    ['themeHeaderBackground', '#4062bb'],
    ['themeHeaderText', '#ffffff'],
    ['themeContentBackground', '#ffffff'],
    ['themeContentText', '#616366'],
    ['themeSecondaryText', '#2d363d'],
    ['themeButtonBackground', '#663399'],
    ['themeAccent', '#663399'],
    ['themeButtonText', '#ffffff'],
    ['themeText', '#060f1d'],
    ['themeDivider', '#e6e9eb'],
    ['themeFooterText', '#949da8'],
]);

export abstract class EmailTemplate {

    protected readonly noReply = new EmailAddressDto('master@sourcelatam.tech', 'Elox Pro');
    protected readonly defaultParams = new Map<string, string>([
        ['site', 'https://sourcelatam.tech'],
        ['logo', 'https://i.imgur.com/QCAX10J.png'],
        ['companyName', 'Elox Pro'],
        ['companyAddress', 'Sir Matt Busby Way, Old Trafford, Stretford, Manchester M16 0RA, United Kingdom.'],
        ...theme
    ]);

    constructor(protected readonly sender: EmailSender) {
    }

    abstract send(to: EmailAddressDto, params: Map<string, string>): Promise<Boolean>;

    protected buildPath(filePath: string) {
        return path.resolve(
            process.cwd(),
            'src/common/email/resources/ejs/',
            filePath
        );
    };
}