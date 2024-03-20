import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenRequestDto {

    @IsString()
    @IsNotEmpty()
    readonly refreshToken: string;

    constructor(refreshToken: string) {
        this.refreshToken = refreshToken;
    }

}
