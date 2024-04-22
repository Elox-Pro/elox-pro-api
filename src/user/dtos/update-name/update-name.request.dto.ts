import { UserRequestDto } from "@app/authorization/dto/active-user.request.dto";
import { IsString } from "class-validator";

export class UpdateNameRequestDto extends UserRequestDto {

    @IsString()
    readonly firstName: string;
    @IsString()
    readonly lastName: string;
}