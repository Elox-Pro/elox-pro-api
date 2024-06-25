import { Module } from "@nestjs/common";
import { CompanyController } from "./controllers/company.controller";
import { FindManyCompaniesUC } from "./usecases/find-many-companies.uc";
import { FindCompanyByIdUC } from "./usecases/find-company-by-id.uc";
import { CreateCompanyUC } from "./usecases/create-company.uc";
import { UpdateCompanyNameUC } from "./usecases/update-company-name.uc";
import { AddUserToCompanyUC } from "./usecases/add-user-to-company.uc";
import { RemoveUserFromCompanyUC } from "./usecases/remove-user-from-company.uc";
import { DeleteCompanyUC } from "./usecases/delete-company.uc";
import { FindManyUsersUC } from "./usecases/find-many-users.uc";

@Module({
    controllers: [CompanyController],
    providers: [
        FindManyCompaniesUC,
        FindCompanyByIdUC,
        CreateCompanyUC,
        UpdateCompanyNameUC,
        AddUserToCompanyUC,
        RemoveUserFromCompanyUC,
        DeleteCompanyUC,
        FindManyUsersUC
    ]
})
export class CompanyModule { }