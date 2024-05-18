import { TfaAction } from "@app/tfa/enums/tfa-action.enum";

export class TfaResponseDto {
    constructor(
        readonly result: boolean,
        readonly action: TfaAction,
        readonly metadata: Record<string, string>
    ) { }
}