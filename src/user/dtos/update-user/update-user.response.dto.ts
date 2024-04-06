import { User } from "@prisma/client";

export class UpdateUserResponseDto {
    constructor(readonly user: User) { 
        user.password = null;
    }
}