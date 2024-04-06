import { Gender, TfaType, UserLang, UserTheme } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class UpdateUserRequestDto {

    @IsString()
    @IsNotEmpty()
    readonly username: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly firstName: string;

    @IsString()
    @IsNotEmpty()
    readonly lastName: string;

    @IsString()
    @IsNotEmpty()
    readonly phone: string;

    @IsEnum(Gender)
    @IsNotEmpty()
    readonly gender: Gender;

    @IsEnum(TfaType)
    @IsNotEmpty()
    readonly tfaType: TfaType;

    @IsEnum(UserLang)
    @IsNotEmpty()
    readonly lang: UserLang;

    @IsEnum(UserTheme)
    @IsNotEmpty()
    readonly theme: UserTheme;

}