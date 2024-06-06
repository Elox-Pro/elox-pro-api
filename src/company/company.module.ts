import { Module } from "@nestjs/common";
import { CompanyController } from "./controllers/company.controller";
import { FindManyCompaniesUC } from "./usecases/find-many-companies.uc";
import { FindCompanyByIdUC } from "./usecases/find-company-by-id.uc";
import { CreateCompanyUC } from "./usecases/create-company.uc";
import { SetCompanyNameUC } from "./usecases/set-company-name.uc";

@Module({
    controllers: [CompanyController],
    providers: [
        FindManyCompaniesUC,
        FindCompanyByIdUC,
        CreateCompanyUC,
        SetCompanyNameUC
    ]
})
export class CompanyModule { }