import { JwtTokensDto } from "../../../jwt-app/dtos/jwt/jwt-tokens.dto";

export class LoginResponseDto {

    constructor(
        readonly isTFAPending: boolean,
        readonly tokens?: JwtTokensDto
    ) { }
}