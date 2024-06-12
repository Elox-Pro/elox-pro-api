import { UserPaginationRequestDto } from "@app/authorization/dto/user-pagination.request.dto";
import { IsNumber, IsOptional } from "class-validator";

export class FindManyUsersRequestDto extends UserPaginationRequestDto {

    @IsNumber()
    @IsOptional()
    readonly skipUsersFromCompanyId: number;
}