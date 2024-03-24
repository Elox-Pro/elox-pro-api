import { TfaAction } from "@app/authentication/enums/tfa-action.enum";
import { User } from "@prisma/client";

export class TFARequestDto {
    constructor(
        readonly user: User,
        readonly ipClient: string,
        readonly action: TfaAction
    ) { }
}