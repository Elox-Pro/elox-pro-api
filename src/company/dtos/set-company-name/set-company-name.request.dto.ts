import { IsNumber, IsString } from "class-validator"

export class SetCompanyNameRequestDto {
    @IsString()
    readonly name: string;

    @IsNumber()
    readonly id: number;
}