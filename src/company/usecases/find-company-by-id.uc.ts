import { IUseCase } from "@app/common/usecase/usecase.interface";
import { Injectable } from "@nestjs/common";
import { FindCompanyByIdRequestDto } from "../dtos/find-company-by-id/find-company-by-id.request.dto";
import { FindCompanyByIdResponseDto } from "../dtos/find-company-by-id/find-company-by-id.response.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { Role } from "@prisma/client";
import { UserTranslator } from "@app/common/translator/user.translator";

@Injectable()
export class FindCompanyByIdUC implements IUseCase<FindCompanyByIdRequestDto, FindCompanyByIdResponseDto> {

    constructor(
        private readonly prisma: PrismaService,
        private userTranslator: UserTranslator
    ) { }
    async execute(request: FindCompanyByIdRequestDto): Promise<FindCompanyByIdResponseDto> {
        const { id } = request;
        const lang = request.getLang();
        const limit = 5;

        const company = await this.prisma.company.findUnique({
            where: {
                id
            }
        });

        const countUsers = await this.prisma.user.count({
            where: {
                companies: {
                    some: {
                        id: id
                    }
                },
                role: {
                    in: [Role.COMPANY_OWNER, Role.COMPANY_ADMIN]
                }
            }
        });

        const usersAux = await this.prisma.user.findMany({
            where: {
                companies: {
                    some: {
                        id: id
                    }
                },
                role: {
                    in: [Role.COMPANY_OWNER, Role.COMPANY_ADMIN]
                }
            },
            take: limit,
        });

        const users = await Promise.all(usersAux.map(async (user) => {
            return await this.userTranslator.translate(user, lang);
        }));

        const countCustomers = await this.prisma.user.count({
            where: {
                companies: {
                    some: {
                        id: id
                    }
                },
                role: Role.COMPANY_CUSTOMER
            }
        });

        const customersAux = await this.prisma.user.findMany({
            where: {
                companies: {
                    some: {
                        id: id
                    }
                },
                role: Role.COMPANY_CUSTOMER
            },
            take: limit,
        });

        const customers = await Promise.all(customersAux.map(async (user) => {
            return await this.userTranslator.translate(user, lang);
        }));


        return new FindCompanyByIdResponseDto(
            company,
            countUsers,
            users,
            countCustomers,
            customers
        );
    }
}