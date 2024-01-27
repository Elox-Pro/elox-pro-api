import { TokensDto } from "./tokens.dto";

export class LoginResponseDTO {
    public readonly tokens: TokensDto;
    public readonly isTFAPending: boolean;

    constructor(tokens: TokensDto, isTFAPending: boolean) {
        this.tokens = tokens;
        this.isTFAPending = isTFAPending;
    }
}