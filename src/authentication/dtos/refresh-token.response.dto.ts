import { JwtTokensDto } from "./jwt-tokens.dto";

export class RefreshTokenResponseDto {
    constructor(readonly tokens: JwtTokensDto) { }
}