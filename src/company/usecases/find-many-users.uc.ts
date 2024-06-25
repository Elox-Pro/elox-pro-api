import { IUseCase } from "@app/common/usecase/usecase.interface";
import { Injectable } from "@nestjs/common";
import { FindManyUsersRequestDto } from "../dtos/find-many-users/find-many-users.request.dto";
import { FindManyUsersResponseDto } from "../dtos/find-many-users/find-many-users.response.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { UserTranslator } from "@app/common/translator/user.translator";
import { Role } from "@prisma/client";
import { RequestLang } from "@app/common/enums/request-lang.enum";

@Injectable()
export class FindManyUsersUC implements IUseCase<FindManyUsersRequestDto, FindManyUsersResponseDto> {

    constructor(
        private readonly prisma: PrismaService,
        private userTranslator: UserTranslator
    ) { }

    /**
    * Executes the use case to find many users that does not belong to the company.
    *
    * @param request - The request object containing pagination, search term, company ID, and language.
    * @returns A promise that resolves to a FindManyUsersResponseDto containing the found users and total count.
    */
    async execute(request: FindManyUsersRequestDto): Promise<FindManyUsersResponseDto> {

        // Extracting necessary properties from the request
        const { page, limit, searchTerm, companyId } = request;
        const lang = request.getLang(); // Assuming getLang() returns the language
        const skip = (page - 1) * limit; // Calculating the skip value for pagination

        // Finding users based on the provided parameters
        const users = await this.find(
            searchTerm, skip, limit, companyId, lang
        );

        // Counting the total number of users based on the provided parameters
        const total = await this.count(searchTerm, companyId);

        // Returning the response object containing the found users and total count
        return new FindManyUsersResponseDto(users, total);
    }

    private async count(searchTerm: string, companyId: number) {
        return await this.prisma.user.count({
            where: {
                role: {
                    in: [Role.COMPANY_OWNER, Role.COMPANY_ADMIN]
                },
                companies: {
                    none: {
                        id: companyId
                    }
                },
                ...(searchTerm ? { username: { contains: searchTerm } } : {}),
            }
        });
    }

    private async find(searchTerm: string,
        skip: number,
        limit: number,
        companyId: number,
        lang: RequestLang,
    ) {
        const data = await this.prisma.user.findMany({
            where: {
                role: {
                    in: [Role.COMPANY_OWNER, Role.COMPANY_ADMIN]
                },
                companies: {
                    none: {
                        id: companyId
                    }
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