import { UserRequestDto } from "@app/authorization/dto/user.request.dto";
import { Gender } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class UpdateGenderRequestDto extends UserRequestDto {

    @IsNotEmpty()
    @IsEnum(Gender)
    readonly gender: Gender;
}