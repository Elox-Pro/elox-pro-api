import { User } from "@prisma/client";

export class FindUserByUserNameResponseDto {

    constructor(
        readonly user: User,
        readonly userTranslations: Record<string, string>,
    ) {
        this.user.password = null;
    }
}