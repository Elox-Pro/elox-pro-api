import { TfaAction } from "@app/authentication/enums/tfa-action.enum";

export class TFADto {
    constructor(
        readonly hash: string,
        readonly action: TfaAction
    ) { }
}