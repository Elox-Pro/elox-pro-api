import { Module } from "@nestjs/common";
import { CompanyController } from "./controllers/company.controller";
import { FindManyCompaniesUC } from "./usecases/find-many-companies.uc";
import { FindCompanyByIdUC } from "./usecases/find-company-by-id.uc";

@Module({
    controllers: [CompanyController],
    providers: [
        FindManyCompaniesUC,
        FindCompanyByIdUC
    ]
})
export class CompanyModule { }