import { UserRequestDto } from "@app/authorization/dto/user.request.dto";
import { IsString } from "class-validator";

export class UpdatePhoneRequestDto extends UserRequestDto {

    @IsString()
    readonly phone: string;
}