import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { Company, Role, User } from "@prisma/client";
import { RemoveUserFromCompanyRequestDto } from "../dtos/remove-user-from-company/remove-user-from-company.request.dto";
import { RemoveUserFromCompanyResponseDto } from "../dtos/remove-user-from-company/remove-user-from-company.response.dto";

@Injectable()
export class RemoveUserFromCompanyUC
    implements IUseCase<RemoveUserFromCompanyRequestDto, RemoveUserFromCompanyResponseDto> {

    private readonly logger = new Logger(RemoveUserFromCompanyUC.name);

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async execute(request: RemoveUserFromCompanyRequestDto): Promise<RemoveUserFromCompanyResponseDto> {
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

        const existsUserInCompany = await this.existsUserInCompany(companyId, userId);
        if (!existsUserInCompany) {
            this.logger.error(
                `User ${user.username} does not belong in company ${company.name}`
            );
            throw new BadRequestException('error.user-does-not-belong-to-company');
        }


        await this.updateCompany(companyId, userId);
        return new RemoveUserFromCompanyResponseDto(true);
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
                    disconnect: {
                        id: userId
                    }
                }
            }
        });
    }

}

