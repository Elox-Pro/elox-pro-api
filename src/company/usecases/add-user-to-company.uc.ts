import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { AddUserToCompanyRequestDto } from "../dtos/add-user-to-company/add-user-to-company.request.dto";
import { AddUserToCompanyResponseDto } from "../dtos/add-user-to-company/add-user-to-company.response.dto";
import { Company, Role, User } from "@prisma/client";

@Injectable()
export class AddUserToCompanyUC implements IUseCase<AddUserToCompanyRequestDto, AddUserToCompanyResponseDto> {

    private readonly logger = new Logger(AddUserToCompanyUC.name);

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async execute(request: AddUserToCompanyRequestDto): Promise<AddUserToCompanyResponseDto> {
        const { companyId, userId } = request;

        const company = await this.findCompany(companyId);
        if (!company) {
            this.logger.error(`Company does not exists: ${companyId}`);
            throw new BadRequestException('error.company-not-found');
        }

        const user = await this.findUser(userId);
        if (!user) {
            this.logger.error(`User does not exists: ${userId}`);
            throw new BadRequestException('error.user-not-found');
        }

        if (user.role !== Role.COMPANY_OWNER && user.role !== Role.COMPANY_ADMIN) {
            this.logger.error(
                `User ${user.username} does not have role ${user.role} to add to company ${company.name}`
            );
            throw new BadRequestException('error.role-not-allowed');
        }

        const existsUserInCompany = await this.existsUserInCompany(companyId, userId);
        if (existsUserInCompany) {
            this.logger.error(
                `User ${user.username} already exists in company ${company.name}`
            );
            throw new BadRequestException('error.user-already-in-company');
        }

        if (user.role === Role.COMPANY_ADMIN) {
            const userOwner = await this.findUserOwner(companyId);
            if (!userOwner) {
                this.logger.error(
                    `Company ${company.name} does not have owner`
                );
                throw new BadRequestException('error.company-does-not-have-owner');
            }
        }

        await this.updateCompany(companyId, userId);
        return new AddUserToCompanyResponseDto(true);
    }

    private async findUserOwner(companyId: number): Promise<User> {
        return await this.prisma.user.findFirst({
            where: {
                role: Role.COMPANY_OWNER,
                company: {
                    id: companyId
                }
            }
        });
    }

    private async existsUserInCompany(companyId: number, userId: number): Promise<boolean> {
        const count = await this.prisma.company.count({
            where: {
                id: companyId,
                users: {
                    some: {
                        id: userId
                    }
                }
            }
        });
        return count > 0;
    }

    private async findUser(userId: number): Promise<User> {
        return await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
    }

    private async findCompany(companyId: number): Promise<Company> {
        return await this.prisma.company.findUnique({
            where: {
                id: companyId
            }
        });
    }

    private async updateCompany(companyId: number, userId: number): Promise<Company> {
        return await this.prisma.company.update({
            where: {
                id: companyId
            },
            data: {
                users: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
    }

}

