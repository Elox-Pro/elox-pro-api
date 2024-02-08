import { JwtTokensDto } from "./jwt-tokens.dto";

export class ValidateTFAResponseDto {
    constructor(readonly tokens: JwtTokensDto) { }
}