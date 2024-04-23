import { UserRequestDto } from "@app/authorization/dto/user.request.dto";
import { Gender, TfaType, UserLang, UserTheme } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class UpdateUserRequestDto extends UserRequestDto {

    @IsString()
    @IsNotEmpty()
    readonly firstName: string;

    @IsString()
    @IsNotEmpty()
    readonly lastName: string;

    @IsEnum(Gender)
    @IsNotEmpty()
    readonly gender: Gender;

    @IsEnum(UserLang)
    @IsNotEmpty()
    readonly lang: UserLang;

    @IsEnum(UserTheme)
    @IsNotEmpty()
    readonly theme: UserTheme;
}