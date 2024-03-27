import { TfaAction } from "@app/authentication/enums/tfa-action.enum";
import { User, UserLang } from "@prisma/client";

export class TFARequestDto {
    constructor(
        readonly user: User,
        readonly ipClient: string,
        readonly action: TfaAction,
        readonly lang: UserLang // Use the user request language
    ) { }
}