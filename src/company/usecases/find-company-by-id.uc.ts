import { IUseCase } from "@app/common/usecase/usecase.interface";
import { Injectable } from "@nestjs/common";
import { FindCompanyByIdRequestDto } from "../dtos/find-company-by-id/find-company-by-id.request.dto";
import { FindCompanyByIdResponseDto } from "../dtos/find-company-by-id/find-company-by-id.response.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { Role } from "@prisma/client";

@Injectable()
export class FindCompanyByIdUC implements IUseCase<FindCompanyByIdRequestDto, FindCompanyByIdResponseDto> {

    constructor(private readonly prisma: PrismaService) { }
    async execute(request: FindCompanyByIdRequestDto): Promise<FindCompanyByIdResponseDto> {
        const { id } = request;
        const company = await this.prisma.company.findUnique({
            where: {
                id
            },
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
        });
        return new FindCompanyByIdResponseDto(company);
    }
}