import { Injectable } from "@nestjs/common";
import { FindManyCompaniesResponseDto } from "../dtos/find-many-companies/find-many-companies.response.dto";
import { FindManyCompaniesRequestDto } from "../dtos/find-many-companies/find-many-companies.request.dto";
import { IUseCase } from "@app/common/usecase/usecase.interface";
import { PrismaService } from "@app/prisma/prisma.service";
import { Role } from "@prisma/client";

@Injectable()
export class FindManyCompaniesUC implements IUseCase<FindManyCompaniesRequestDto, FindManyCompaniesResponseDto> {

    constructor(private readonly prisma: PrismaService) { }
    async execute(request: FindManyCompaniesRequestDto): Promise<FindManyCompaniesResponseDto> {

        const { page, limit } = request;
        const skip = (page - 1) * limit;
        
        const companies = await this.prisma.company.findMany({
            include: {
                users: {
                    select: {
                        username: true,
                    },
                    where: {
                        role: Role.COMPANY_OWNER
                    }
                }
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        const total = await this.prisma.company.count();

        return new FindManyCompaniesResponseDto(companies, total);
    }
}