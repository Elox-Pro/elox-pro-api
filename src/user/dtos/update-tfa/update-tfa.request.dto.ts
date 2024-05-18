import { UserRequestDto } from "@app/authorization/dto/user.request.dto";
import { TfaType } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateTfaRequestDto extends UserRequestDto {
    @IsEnum(TfaType)
    readonly tfaType: TfaType;
}