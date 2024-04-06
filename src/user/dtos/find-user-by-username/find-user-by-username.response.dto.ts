import { User } from "@prisma/client";

export class FindUserByUserNameResponseDto {

    constructor(readonly user: User) {
        this.user.password = null;
     }
}