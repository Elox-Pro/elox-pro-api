import { User, UserLang } from "@prisma/client";
import { EmailType } from "../../enums/email-type.enum";

export class EmailProcessorRequestDto {

    constructor(
        readonly type: EmailType,
        readonly user: User,
        readonly lang: UserLang // Use the user request language
    ) { }
}