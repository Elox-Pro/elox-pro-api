import { Company } from "@prisma/client";

export class CreateCompanyResponseDto {
    constructor(readonly company: Company) {
    }
}