import { GuestRequestDto } from "@app/authorization/dto/guest.request.dto";
import { IsString } from "class-validator";
export class RecoverPasswordResetRequestDto extends GuestRequestDto {

    @IsString()
    readonly username: string;

    @IsString()
    readonly password1: string;

    @IsString()
    readonly password2: string;

    @IsString()
    readonly grecaptchaToken: string;
}