import { UserRequestDto } from "@app/authorization/dto/user.request.dto";
import { IsNumber } from "class-validator";

export class FindCompanyByIdRequestDto extends UserRequestDto {
    @IsNumber()
    readonly id: number;
}