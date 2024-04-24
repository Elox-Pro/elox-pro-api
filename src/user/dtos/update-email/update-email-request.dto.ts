import { UserRequestDto } from "@app/authorization/dto/user.request.dto";
import { IsEmail, IsNotEmpty } from "class-validator";

export class UpdateEmailRequestDto extends UserRequestDto {

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
}