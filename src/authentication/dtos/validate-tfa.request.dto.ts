import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ValidateTFARequestDto {

    @IsNumber()
    @IsNotEmpty()
    public readonly code: number;

    @IsString()
    @IsNotEmpty()
    public readonly username: string;
}