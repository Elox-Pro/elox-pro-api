import { IsNumber, IsString } from "class-validator"

export class UpdateCompanyNameRequestDto {
    @IsString()
    readonly name: string;

    @IsNumber()
    readonly id: number;
}