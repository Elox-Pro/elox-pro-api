import { IsEnum, IsString } from "class-validator";
import { Response } from "express";
import { RequestLang } from "@app/common/enums/request-lang.enum";

export class LoginRequestDto {

    @IsString()
    readonly username: string;

    @IsString()
    readonly password: string;

    @IsString()
    readonly ipClient: string;

    @IsString()
    readonly grecaptchaToken: string

    @IsEnum(RequestLang)
    readonly lang: RequestLang;

    private response: Response;

    setResponse(response: Response): void {
        this.response = response;
    }

    getResponse(): Response {
        return this.response;
    }

}
