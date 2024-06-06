import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { CreateCompanyRequestDto } from "../dtos/create-company/create-company.request.dto";
import { CreateCompanyResponseDto } from "../dtos/create-company/create-company.response.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { Company } from "@prisma/client";
import { escapeForUrl } from "@app/common/helpers/escape-for-url.helper";

@Injectable()
export class CreateCompanyUC implements IUseCase<CreateCompanyRequestDto, CreateCompanyResponseDto> {

    private readonly logger = new Logger(CreateCompanyUC.name);

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async execute(request: CreateCompanyRequestDto): Promise<CreateCompanyResponseDto> {

        const { name } = request;

        if (await this.existsCompany(name)) {
            this.logger.error(`Company already exists: ${name}`);
            throw new BadRequestException('error.company-already-exists');
        }

        return new CreateCompanyResponseDto(await this.createCompany(name));
    }

    private async existsCompany(name: string): Promise<boolean> {
        const count = await this.prisma.company.count({
            where: {
                name
            }
        });
        return count > 0;
    }

    private async createCompany(name: string): Promise<Company> {
        const imageName = escapeForUrl(name);
        const imageUrl = "https://api.dicebear.com/8.x/identicon/svg?seed=" + imageName;
        return await this.prisma.company.create({
            data: {
                name,
                imageUrl,
            }
        });
    }
}

