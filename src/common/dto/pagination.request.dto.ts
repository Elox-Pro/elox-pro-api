import { IsNumber, IsOptional, IsString } from "class-validator";

export class PaginationRequestDto {
    @IsNumber()
    readonly page: number;

    @IsNumber()
    readonly limit: number;

    @IsString()
    @IsOptional()
    readonly searchTerm: string;
}