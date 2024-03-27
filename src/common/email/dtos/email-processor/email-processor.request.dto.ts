import { User } from "@prisma/client";
import { EmailType } from "../../enums/email-type.enum";

export class EmailProcessorRequestDto {

    constructor(
        readonly type: EmailType,
        readonly user: User
    ) { }
}