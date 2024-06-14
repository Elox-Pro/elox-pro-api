import { IsNumber } from "class-validator";

export class DeleteCompanyRequestDto {
    @IsNumber()
    readonly id: number;
}