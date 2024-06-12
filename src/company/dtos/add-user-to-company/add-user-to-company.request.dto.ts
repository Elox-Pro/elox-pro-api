import { IsNumber } from "class-validator";

export class AddUserToCompanyRequestDto {
    @IsNumber()
    readonly userId: number;

    @IsNumber()
    readonly companyId: number;
}