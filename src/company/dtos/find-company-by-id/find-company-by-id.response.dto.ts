import { Company } from "@prisma/client";

export class FindCompanyByIdResponseDto {
    constructor(
        readonly company: Company
    ) { }
}