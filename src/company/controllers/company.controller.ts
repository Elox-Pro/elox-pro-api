import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { Roles } from "@app/authorization/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { FindManyCompaniesUC } from "../usecases/find-many-companies.uc";
import { FindManyCompaniesResponseDto } from "../dtos/find-many-companies/find-many-companies.response.dto";

/**
 * Controller for managing companies.
 * @author Yonatan A Quintero R
 * @date 2024-05-20
 */
@Roles(Role.SYSTEM_ADMIN)
@Controller('companies')
export class CompanyController {
    constructor(
        private readonly findManyCompaniesUC: FindManyCompaniesUC
    ) { }

    @Get("/")
    @HttpCode(HttpStatus.OK)
    companies(): Promise<FindManyCompaniesResponseDto> {
        return this.findManyCompaniesUC.execute();
    }
}