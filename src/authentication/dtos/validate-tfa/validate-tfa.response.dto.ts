import { TfaType } from "@prisma/client";
import { JwtTokensDto } from "../jwt/jwt-tokens.dto";
import { TfaAction } from "@app/authentication/enums/tfa-action.enum";

export class ValidateTFAResponseDto {
    constructor(
        readonly type: TfaType,
        readonly action: TfaAction,
        readonly tokens?: JwtTokensDto
    ) { }
}