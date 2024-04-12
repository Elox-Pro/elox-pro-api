import { UserRequestDto } from "@app/authorization/dto/active-user.request.dto";
import { IsString } from "class-validator";

export class UpdateAvatarRequestDto extends UserRequestDto {

    @IsString()
    readonly avatarUrl: string;
};