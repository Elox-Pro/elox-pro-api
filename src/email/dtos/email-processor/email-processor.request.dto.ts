import { User } from "@prisma/client";
import { EmailType } from "../../enums/email-type.enum";
import { RequestLang } from "@app/common/enums/request-lang.enum";

export class EmailProcessorRequestDto {

    constructor(
        readonly type: EmailType,
        readonly user: User,
        readonly lang: RequestLang
    ) { }
}