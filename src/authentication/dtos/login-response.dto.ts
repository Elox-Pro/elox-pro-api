import { JwtOutputDto } from "./jwt-output.dto";

export class LoginResponseDto {
    public readonly tokens: JwtOutputDto;
    public readonly isTFAPending: boolean;

    constructor(tokens: JwtOutputDto, isTFAPending: boolean) {
        this.tokens = tokens;
        this.isTFAPending = isTFAPending;
    }
}