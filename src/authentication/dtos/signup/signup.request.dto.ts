import { GuestRequestDto } from "@app/authorization/dto/guest.request.dto";
import { IsEmail, IsString } from "class-validator";

export class SignupRequestDto extends GuestRequestDto {

    @IsString()
    readonly username: string;

    @IsEmail()
    readonly email: string;

    @IsString()
    readonly password1: string;

    @IsString()
    readonly password2: string;

    @IsString()
    readonly grecaptchaToken: string;
}