import { UserLang } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";
import { Response } from "express";

export class LoginRequestDto {

    @IsString()
    readonly username: string;

    @IsString()
    readonly password: string;

    @IsString()
    readonly ipClient: string;

    @IsString()
    readonly grecaptchaToken: string

    @IsEnum(UserLang)
    readonly lang: UserLang;

    private response: Response;

    setResponse(response: Response): void {
        this.response = response;
    }

    getResponse(): Response {
        return this.response;
    }

}
