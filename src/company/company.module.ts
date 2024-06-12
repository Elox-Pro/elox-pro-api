import { Module } from "@nestjs/common";
import { CompanyController } from "./controllers/company.controller";
import { FindManyCompaniesUC } from "./usecases/find-many-companies.uc";
import { FindCompanyByIdUC } from "./usecases/find-company-by-id.uc";
import { CreateCompanyUC } from "./usecases/create-company.uc";
import { UpdateCompanyNameUC } from "./usecases/update-company-name.uc";
import { AddUserToCompanyUC } from "./usecases/add-user-to-company.uc";
import { RemoveUserFromCompanyUC } from "./usecases/remove-user-from-company.uc";

@Module({
    controllers: [CompanyController],
    providers: [
        FindManyCompaniesUC,
        FindCompanyByIdUC,
        CreateCompanyUC,
        UpdateCompanyNameUC,
        AddUserToCompanyUC,
        RemoveUserFromCompanyUC
    ]
})
export class CompanyModule { }