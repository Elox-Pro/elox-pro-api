import { UserLang } from "@prisma/client";
import { IsEnum, IsString } from "class-validator";

export class RecoverPasswordInitRequestDto {

    @IsString()
    readonly username: string;

    @IsString()
    readonly ipClient: string;

    @IsString()
    readonly grecaptchaToken: string

    @IsEnum(UserLang)
    readonly lang: UserLang;
}