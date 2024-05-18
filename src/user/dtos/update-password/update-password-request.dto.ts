import { UserRequestDto } from "@app/authorization/dto/user.request.dto";
import { IsNotEmpty } from "class-validator";

export class UpdatePasswordRequestDto extends UserRequestDto {

    @IsNotEmpty()
    readonly currentPassword: string;

    @IsNotEmpty()
    readonly newPassword: string;

    @IsNotEmpty()
    readonly confirmPassword: string;
}