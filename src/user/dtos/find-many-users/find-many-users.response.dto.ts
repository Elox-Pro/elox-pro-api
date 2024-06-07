import { UserType } from "@app/user/types/user.type";

export class FindManyUsersResponseDto {
    constructor(
        readonly users: UserType[],
        readonly total: number,
    ) { }
}