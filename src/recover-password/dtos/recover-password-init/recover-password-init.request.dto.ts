import { GuestRequestDto } from "@app/authorization/dto/guest.request.dto";
import { IsString } from "class-validator";

export class RecoverPasswordInitRequestDto extends GuestRequestDto {

    @IsString()
    readonly username: string;

    @IsString()
    readonly grecaptchaToken: string
}