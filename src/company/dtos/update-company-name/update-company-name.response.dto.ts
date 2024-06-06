import { Company } from "@prisma/client";

export class UpdateCompanyNameResponseDto {
    constructor(readonly company: Company) {
    }
}