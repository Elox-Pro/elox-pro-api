import { IsNumber } from "class-validator";

export class RemoveUserFromCompanyRequestDto {
    @IsNumber()
    readonly userId: number;

    @IsNumber()
    readonly companyId: number;
}