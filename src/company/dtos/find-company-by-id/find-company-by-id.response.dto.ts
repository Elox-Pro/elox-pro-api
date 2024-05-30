import { UserType } from "@app/user/types/user.type";
import { Company } from "@prisma/client";

export class FindCompanyByIdResponseDto {
    constructor(
        readonly company: Company,
        readonly totalUsers: number,
        readonly users: UserType[],
        readonly totalCustomers: number,
        readonly customers: UserType[],
    ) { }
}