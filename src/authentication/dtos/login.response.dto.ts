import { JwtResponseDto } from "./jwt.response.dto";

export class LoginResponseDto {
    public readonly tokens: JwtResponseDto;
    public readonly isTFAPending: boolean;

    constructor(tokens: JwtResponseDto, isTFAPending: boolean) {
        this.tokens = tokens;
        this.isTFAPending = isTFAPending;
    }
}