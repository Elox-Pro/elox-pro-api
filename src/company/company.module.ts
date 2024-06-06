import { Module } from "@nestjs/common";
import { CompanyController } from "./controllers/company.controller";
import { FindManyCompaniesUC } from "./usecases/find-many-companies.uc";
import { FindCompanyByIdUC } from "./usecases/find-company-by-id.uc";
import { CreateCompanyUC } from "./usecases/create-company.uc";
import { UpdateCompanyNameUC } from "./usecases/update-company-name.uc";

@Module({
    controllers: [CompanyController],
    providers: [
        FindManyCompaniesUC,
        FindCompanyByIdUC,
        CreateCompanyUC,
        UpdateCompanyNameUC
    ]
})
export class CompanyModule { }