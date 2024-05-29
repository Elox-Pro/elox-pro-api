import { Controller, Get, HttpCode, HttpStatus, Param, Query, Req } from "@nestjs/common";
import { Roles } from "@app/authorization/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { FindManyCompaniesUC } from "../usecases/find-many-companies.uc";
import { FindManyCompaniesResponseDto } from "../dtos/find-many-companies/find-many-companies.response.dto";
import { FindManyCompaniesRequestDto } from "../dtos/find-many-companies/find-many-companies.request.dto";
import { FindCompanyByIdUC } from "../usecases/find-company-by-id.uc";
import { FindCompanyByIdRequestDto } from "../dtos/find-company-by-id/find-company-by-id.request.dto";
import { FindCompanyByIdResponseDto } from "../dtos/find-company-by-id/find-company-by-id.response.dto";

/**
 * Controller for managing companies.
 * @author Yonatan A Quintero R
 * @date 2024-05-20
 */
@Roles(Role.SYSTEM_ADMIN)
@Controller('companies')
export class CompanyController {
    constructor(
        private readonly findManyCompaniesUC: FindManyCompaniesUC,
        private readonly findCompanyByIdUC: FindCompanyByIdUC
    ) { }

    @Get("/")
    @HttpCode(HttpStatus.OK)
    companies(@Query() request: FindManyCompaniesRequestDto): Promise<FindManyCompaniesResponseDto> {
        return this.findManyCompaniesUC.execute(request);
    }

    @Get("/:id")
    @HttpCode(HttpStatus.OK)
    company(@Param() request: FindCompanyByIdRequestDto): Promise<FindCompanyByIdResponseDto> {
        return this.findCompanyByIdUC.execute(request);
    }
}