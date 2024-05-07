import { TfaResponseDto } from "@app/common/dto/tfa.response.dto";
import { JwtTokensDto } from "../../../jwt-app/dtos/jwt/jwt-tokens.dto";

export class LoginResponseDto extends TfaResponseDto {

    constructor(
        readonly isTFAPending: boolean,
        readonly tokens?: JwtTokensDto
    ) {
        super(isTFAPending);
    }
}