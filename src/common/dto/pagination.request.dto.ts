import { IsNumber } from "class-validator";

export class PaginationRequestDto {
    @IsNumber()
    readonly page: number;

    @IsNumber()
    readonly limit: number;
}