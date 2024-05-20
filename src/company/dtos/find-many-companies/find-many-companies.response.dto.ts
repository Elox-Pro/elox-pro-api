import { Company } from "@prisma/client";

export class FindManyCompaniesResponseDto {
    constructor(readonly companies: Company[]) { }
}