import { JwtTokensDto } from "../jwt/jwt-tokens.dto";

export class RefreshTokenResponseDto {
    constructor(readonly tokens: JwtTokensDto) { }
}