import { RequestLang } from "@app/common/enums/request-lang.enum";
import { IsEnum, IsString } from "class-validator";

export class RecoverPasswordInitRequestDto {

    @IsString()
    readonly username: string;

    @IsString()
    readonly ipClient: string;

    @IsString()
    readonly grecaptchaToken: string

    @IsEnum(RequestLang)
    readonly lang: RequestLang;
}