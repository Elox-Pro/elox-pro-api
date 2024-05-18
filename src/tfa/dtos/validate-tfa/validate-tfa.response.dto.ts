import { TfaType } from "@prisma/client";
import { JwtTokensDto } from "../../../jwt-app/dtos/jwt/jwt-tokens.dto";
import { TfaAction } from "@app/tfa/enums/tfa-action.enum";

export class ValidateTFAResponseDto {
    constructor(
        readonly type: TfaType,
        readonly action: TfaAction,
        readonly tokens?: JwtTokensDto
    ) { }
}