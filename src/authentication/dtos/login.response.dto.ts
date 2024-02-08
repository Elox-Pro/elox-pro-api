import { JwtTokensDto } from "./jwt-tokens.dto";

export class LoginResponseDto {

    constructor(
        readonly isTFAPending: boolean,
        readonly jwtTokens: JwtTokensDto
    ) { }
}