import { GuestRequestDto } from "@app/authorization/dto/guest.request.dto";
import { IsString } from "class-validator";

export class LoginRequestDto extends GuestRequestDto {

    @IsString()
    readonly username: string;

    @IsString()
    readonly password: string;

    @IsString()
    readonly grecaptchaToken: string

}
