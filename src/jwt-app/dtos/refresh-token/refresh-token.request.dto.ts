import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenRequestDto {

    @IsString()
    @IsNotEmpty()
    readonly refreshToken: string;

    @IsString()
    readonly ipClient: string;

    constructor(refreshToken: string, ipClient: string) {
        this.refreshToken = refreshToken;
        this.ipClient = ipClient;
    }

}
