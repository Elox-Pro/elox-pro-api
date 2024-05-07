import { GuestRequestDto } from "@app/authorization/dto/guest.request.dto";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ValidateTFARequestDto extends GuestRequestDto {

    @IsNumber()
    @IsNotEmpty()
    public readonly code: number;

    @IsString()
    @IsNotEmpty()
    public readonly username: string;
}