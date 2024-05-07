import { UserRequestDto } from "@app/authorization/dto/user.request.dto";
import { Gender } from "@prisma/client";
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

}