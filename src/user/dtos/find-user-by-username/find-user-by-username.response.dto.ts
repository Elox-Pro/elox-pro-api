import { UserType } from "@app/user/types/user.type";

export class FindUserByUserNameResponseDto {

    constructor(
        readonly user: UserType,
    ) {
        this.user.password = null;
    }
}