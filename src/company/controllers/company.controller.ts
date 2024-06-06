import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req } from "@nestjs/common";
import { Roles } from "@app/authorization/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { FindManyCompaniesUC } from "../usecases/find-many-companies.uc";
import { FindManyCompaniesResponseDto } from "../dtos/find-many-companies/find-many-companies.response.dto";
import { FindManyCompaniesRequestDto } from "../dtos/find-many-companies/find-many-companies.request.dto";
import { FindCompanyByIdUC } from "../usecases/find-company-by-id.uc";
import { FindCompanyByIdRequestDto } from "../dtos/find-company-by-id/find-company-by-id.request.dto";
import { FindCompanyByIdResponseDto } from "../dtos/find-company-by-id/find-company-by-id.response.dto";
import { ActiveUserDto } from "@app/authorization/dto/active-user.dto";
import { UserRequest } from "@app/authorization/decorators/user.request.decorator";
import { CreateCompanyUC } from "../usecases/create-company.uc";
import { CreateCompanyRequestDto } from "../dtos/create-company/create-company.request.dto";
import { CreateCompanyResponseDto } from "../dtos/create-company/create-company.response.dto";
import { SetCompanyNameUC } from "../usecases/set-company-name.uc";
import { SetCompanyNameRequestDto } from "../dtos/set-company-name/set-company-name.request.dto";
import { SetCompanyNameResponseDto } from "../dtos/set-company-name/set-company-name.response.dto";

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
        private readonly findCompanyByIdUC: FindCompanyByIdUC,
        private readonly createCompanyUC: CreateCompanyUC,
        private readonly setCompnayNameUC: SetCompanyNameUC,
    ) { }

    @Get("/")
    @HttpCode(HttpStatus.OK)
    findManyCompanies(@Query() request: FindManyCompaniesRequestDto): Promise<FindManyCompaniesResponseDto> {
        return this.findManyCompaniesUC.execute(request);
    }

    @Get("/find/:id")
    @HttpCode(HttpStatus.OK)
    findCompanyById(
        @UserRequest() activeUser: ActiveUserDto,
        @Param() request: FindCompanyByIdRequestDto
    ): Promise<FindCompanyByIdResponseDto> {
        request.setActiveUser(activeUser);
        return this.findCompanyByIdUC.execute(request);
    }

    @Post("/create")
    @HttpCode(HttpStatus.CREATED)
    createCompany(
        @Body() request: CreateCompanyRequestDto,
    ): Promise<CreateCompanyResponseDto> {
        return this.createCompanyUC.execute(request);
    }

    @Post("/set-name")
    @HttpCode(HttpStatus.OK)
    setName(
        @Body() request: SetCompanyNameRequestDto,
    ): Promise<SetCompanyNameResponseDto> {
        return this.setCompnayNameUC.execute(request);
    }
}