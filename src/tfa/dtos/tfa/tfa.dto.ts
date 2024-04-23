import { TfaAction } from "@app/tfa/enums/tfa-action.enum";

export class TFADto {
    constructor(
        readonly hash: string,
        readonly action: TfaAction,
        readonly metadata: Record<string, string>
    ) { }
}