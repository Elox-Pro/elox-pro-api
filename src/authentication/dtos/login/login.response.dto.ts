import { JwtTokensDto } from "../jwt/jwt-tokens.dto";

export class LoginResponseDto {

    constructor(
        readonly isTFAPending: boolean,
        readonly tokens: JwtTokensDto
    ) { }
}