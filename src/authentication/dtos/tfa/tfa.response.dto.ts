import { TfaAction } from "@app/authentication/enums/tfa-action.enum";

export class TFAResponseDto {
    constructor(
        readonly result: boolean,
        readonly action: TfaAction
    ) { }
}