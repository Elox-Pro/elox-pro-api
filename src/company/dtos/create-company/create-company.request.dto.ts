import { IsString } from "class-validator";

export class CreateCompanyRequestDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly username: string;
}