import { IsEmail, IsString } from "class-validator";
import { RequestLang } from "@app/common/enums/request-lang.enum";

export class SignupRequestDto {

    @IsString()
    readonly username: string;

    @IsEmail()
    readonly email: string;

    @IsString()
    readonly password1: string;

    @IsString()
    readonly password2: string;

    @IsString()
    readonly grecaptchaToken: string;

    @IsString()
    readonly lang: RequestLang;

    @IsString()
    readonly ipClient: string;
}