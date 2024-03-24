import { UserLang } from "@prisma/client";
import { IsEmail, IsString } from "class-validator";

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
    readonly lang: UserLang;

    @IsString()
    readonly ipClient: string;
}