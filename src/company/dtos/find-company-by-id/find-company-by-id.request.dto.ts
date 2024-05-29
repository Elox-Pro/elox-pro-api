import { IsNumber } from "class-validator";

export class FindCompanyByIdRequestDto {
    @IsNumber()
    readonly id: number;
}