import { Module } from "@nestjs/common";
import { CompanyController } from "./controllers/company.controller";
import { FindManyCompaniesUC } from "./usecases/find-many-companies.uc";

@Module({
    controllers: [CompanyController],
    providers: [FindManyCompaniesUC]
})
export class CompanyModule { }