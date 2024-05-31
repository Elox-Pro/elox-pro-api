import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { CreateCompanyRequestDto } from "../dtos/create-company/create-company.request.dto";
import { CreateCompanyResponseDto } from "../dtos/create-company/create-company.response.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { Company, Role, User } from "@prisma/client";
import { escapeForUrl } from "@app/common/helpers/escape-for-url.helper";

@Injectable()
export class CreateCompanyUC implements IUseCase<CreateCompanyRequestDto, CreateCompanyResponseDto> {

    private readonly logger = new Logger(CreateCompanyUC.name);

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async execute(request: CreateCompanyRequestDto): Promise<CreateCompanyResponseDto> {

        const { name, username } = request;

        if (await this.existsCompany(name)) {
            this.logger.error(`Company already exists: ${name}`);
            throw new BadRequestException('error.company-already-exists');
        }

        const user = await this.findUser(username);

        if (!user) {
            this.logger.error(`User does not exists: ${username}`);
            throw new BadRequestException('error.user-not-found');
        }

        if (user.role !== Role.COMPANY_OWNER) {
            this.logger.error(`User is not a company owner: ${username}`);
            throw new BadRequestException('error.user-not-company-owner');
        }

        await this.createCompany(name, username);

        return new CreateCompanyResponseDto(true);
    }

    private async existsCompany(name: string): Promise<boolean> {
        const count = await this.prisma.company.count({
            where: {
                name
            }
        });
        return count > 0;
    }

    private async findUser(username: string): Promise<User> {
        return await this.prisma.user.findUnique({
            where: {
                username
            }
        });
    }

    private async createCompany(name: string, username: string): Promise<Company> {
        const imageName = escapeForUrl(name);
        const imageUrl = "https://api.dicebear.com/8.x/identicon/svg?seed=" + imageName;
        return await this.prisma.company.create({
            data: {
                name,
                imageUrl,
                users: {
                    connect: {
                        username
                    }
                }
            }
        });
    }
}

