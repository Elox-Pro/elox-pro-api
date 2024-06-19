import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req } from "@nestjs/common";
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
import { UpdateCompanyNameUC } from "../usecases/update-company-name.uc";
import { UpdateCompanyNameRequestDto } from "../dtos/update-company-name/update-company-name.request.dto";
import { UpdateCompanyNameResponseDto } from "../dtos/update-company-name/update-company-name.response.dto";
import { AddUserToCompanyUC } from "../usecases/add-user-to-company.uc";
import { AddUserToCompanyRequestDto } from "../dtos/add-user-to-company/add-user-to-company.request.dto";
import { AddUserToCompanyResponseDto } from "../dtos/add-user-to-company/add-user-to-company.response.dto";
import { RemoveUserFromCompanyUC } from "../usecases/remove-user-from-company.uc";
import { RemoveUserFromCompanyRequestDto } from "../dtos/remove-user-from-company/remove-user-from-company.request.dto";
import { RemoveUserFromCompanyResponseDto } from "../dtos/remove-user-from-company/remove-user-from-company.response.dto";
import { DeleteCompanyUC } from "../usecases/delete-company.uc";
import { DeleteCompanyRequestDto } from "../dtos/delete-company/delete-company.request.dto";
import { DeleteCompanyResponseDto } from "../dtos/delete-company/delete-company.response.dto";

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
        private readonly setCompnayNameUC: UpdateCompanyNameUC,
        private readonly addUserToCompanyUC: AddUserToCompanyUC,
        private readonly removeUserFromCompanyUC: RemoveUserFromCompanyUC,
        private readonly deleteCompanyUC: DeleteCompanyUC
    ) { }

    @Post("/")
    @HttpCode(HttpStatus.OK)
    findManyCompanies(@Body() request: FindManyCompaniesRequestDto): Promise<FindManyCompaniesResponseDto> {
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

    @Patch("/update/name")
    @HttpCode(HttpStatus.OK)
    setName(
        @Body() request: UpdateCompanyNameRequestDto,
    ): Promise<UpdateCompanyNameResponseDto> {
        return this.setCompnayNameUC.execute(request);
    }

    @Patch("/add/user")
    @HttpCode(HttpStatus.OK)
    addUser(
        @Body() request: AddUserToCompanyRequestDto,
    ): Promise<AddUserToCompanyResponseDto> {
        return this.addUserToCompanyUC.execute(request);
    }

    @Delete("/remove/user")
    @HttpCode(HttpStatus.OK)
    removeUser(
        @Body() request: RemoveUserFromCompanyRequestDto,
    ): Promise<RemoveUserFromCompanyResponseDto> {
        return this.removeUserFromCompanyUC.execute(request);
    }

    @Delete("/delete/company")
    @HttpCode(HttpStatus.OK)
    deleteCompany(
        @Body() request: DeleteCompanyRequestDto,
    ): Promise<DeleteCompanyResponseDto> {
        return this.deleteCompanyUC.execute(request);
    }
}