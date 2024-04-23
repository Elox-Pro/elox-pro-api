import { UserRequestDto } from "@app/authorization/dto/user.request.dto";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateEmailRequestDto extends UserRequestDto {

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    readonly ipClient: string;
}