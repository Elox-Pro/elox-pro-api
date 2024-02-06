import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ValidateTfaDto {

    @IsNumber()
    @IsNotEmpty()
    public readonly code: number;

    @IsString()
    @IsNotEmpty()
    public readonly username: string;
}