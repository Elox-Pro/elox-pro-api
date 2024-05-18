import { TfaActionKey } from "@app/tfa/enums/tfa-action-key.enum";
import { TfaAction } from "@app/tfa/enums/tfa-action.enum";
import { User } from "@prisma/client";
import { RequestLang } from "@app/common/enums/request-lang.enum";

export class TfaRequestDto {
    constructor(
        readonly user: User,
        readonly ipClient: string,
        readonly action: TfaAction,
        readonly lang: RequestLang,
        readonly metadata: Record<TfaActionKey, string> | null = null
    ) { }
}