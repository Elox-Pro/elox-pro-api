import { JwtTokensDto } from "../jwt/jwt-tokens.dto";

export class ValidateTFAResponseDto {
    constructor(readonly tokens: JwtTokensDto) { }
}