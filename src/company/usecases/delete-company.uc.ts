import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { Company } from "@prisma/client";
import { DeleteCompanyRequestDto } from "../dtos/delete-company/delete-company.request.dto";
import { DeleteCompanyResponseDto } from "../dtos/delete-company/delete-company.response.dto";

@Injectable()
export class DeleteCompanyUC
    implements IUseCase<DeleteCompanyRequestDto, DeleteCompanyResponseDto> {

    private readonly logger = new Logger(DeleteCompanyUC.name);

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async execute(request: DeleteCompanyRequestDto): Promise<DeleteCompanyResponseDto> {
        const { id } = request;

        const company = await this.findCompany(id);
        if (!company) {
            this.logger.error(`Company does not exists: ${id}`);
            throw new BadRequestException('error.company-not-found');
        }

        const usersInCompany = await this.countUsersInCompany(id);
        if (usersInCompany > 0) {
            this.logger.error(`Company has users: ${company.name}`);
            throw new BadRequestException('error.company-has-users');
        }

        await this.deleteCompany(id);
        return new DeleteCompanyResponseDto(true);
    }

    private async findCompany(companyId: number): Promise<Company> {
        return await this.prisma.company.findUnique({
            where: {
                id: companyId
            }
        });
    }

    private async countUsersInCompany(companyId: number): Promise<number> {
        return await this.prisma.user.count({
            where: {
                companies: {
                    some: {
                        id: companyId
                    }
                }
            }
        });
    }

    private async deleteCompany(id: number): Promise<Company> {
        return await this.prisma.company.delete({
            where: {
                id: id
            }
        });
    }

}

