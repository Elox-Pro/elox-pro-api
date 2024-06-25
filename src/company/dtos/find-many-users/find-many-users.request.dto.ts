import { UserPaginationRequestDto } from "@app/authorization/dto/user-pagination.request.dto";
import { IsNumber } from "class-validator";

export class FindManyUsersRequestDto extends UserPaginationRequestDto {

    @IsNumber()
    readonly companyId: number;
}