import { Injectable } from "@nestjs/common";
import { IUseCase } from "@app/common/usecase/usecase.interface";
import { PrismaService } from "@app/prisma/prisma.service";
import { Role } from "@prisma/client";
import { FindManyUsersRequestDto } from "../dtos/find-many-users/find-many-users.request.dto";
import { FindManyUsersResponseDto } from "../dtos/find-many-users/find-many-users.response.dto";
import { UserTranslator } from "@app/common/translator/user.translator";
import { RequestLang } from "@app/common/enums/request-lang.enum";

@Injectable()
export class FindManyUsersUC implements IUseCase<FindManyUsersRequestDto, FindManyUsersResponseDto> {

    constructor(
        private readonly prisma: PrismaService,
        private userTranslator: UserTranslator
    ) { }

    async execute(request: FindManyUsersRequestDto): Promise<FindManyUsersResponseDto> {

        const { page, limit, searchTerm, skipUsersFromCompanyId } = request;
        const lang = request.getLang();
        const skip = (page - 1) * limit;

        const users = await this.find(
            searchTerm, skip, limit, skipUsersFromCompanyId, lang
        );
        const total = await this.count(searchTerm, skipUsersFromCompanyId);

        return new FindManyUsersResponseDto(users, total);
    }

    private async count(searchTerm: string, skipUsersFromCompanyId: number) {
        return await this.prisma.user.count({
            where: {
                role: {
                    in: [Role.COMPANY_OWNER, Role.COMPANY_ADMIN]
                },
                ...(searchTerm ? { username: { contains: searchTerm } } : {}),
            }
        });
    }

    private async find(searchTerm: string,
        skip: number,
        limit: number,
        skipUsersFromCompanyId: number,
        lang: RequestLang,
    ) {
        const data = await this.prisma.user.findMany({
            where: {
                role: {
                    in: [Role.COMPANY_OWNER, Role.COMPANY_ADMIN]
                },
                companyId: {
                    not: skipUsersFromCompanyId
                },
                ...(searchTerm ? { username: { contains: searchTerm } } : {}),
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        return await Promise.all(data.map(async (user) => {
            return await this.userTranslator.translate(user, lang);
        }));
    }
}