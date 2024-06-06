import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { UpdateCompanyNameResponseDto } from "../dtos/update-company-name/update-company-name.response.dto";
import { UpdateCompanyNameRequestDto } from "../dtos/update-company-name/update-company-name.request.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { Company } from "@prisma/client";
import { escapeForUrl } from "@app/common/helpers/escape-for-url.helper";

@Injectable()
export class UpdateCompanyNameUC implements IUseCase<UpdateCompanyNameRequestDto, UpdateCompanyNameResponseDto> {

    private readonly logger = new Logger(UpdateCompanyNameUC.name);

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async execute(request: UpdateCompanyNameRequestDto): Promise<UpdateCompanyNameResponseDto> {

        const { name, id } = request;

        const company = await this.findCompany(id);

        if (!company) {
            this.logger.error(`Company does not exists: ${id}`);
            throw new BadRequestException('error.company-not-found');
        }

        if (company.name === name) {
            this.logger.error(`Company name is equal: ${name}`);
            throw new BadRequestException('error.company-name-is-equal');
        }

        if (await this.existsCompanyByName(name)) {
            this.logger.error(`Company already exists: ${name}`);
            throw new BadRequestException('error.company-already-exists');
        }

        return new UpdateCompanyNameResponseDto(await this.update(id, name));

    }

    private async existsCompanyByName(name: string): Promise<boolean> {
        const count = await this.prisma.company.count({
            where: {
                name
            }
        });
        return count > 0;
    }

    private async findCompany(id: number): Promise<Company> {
        return await this.prisma.company.findUnique({
            where: {
                id
            }
        });
    }

    private async update(id: number, name: string): Promise<Company> {
        const imageUrl = this.getImageUrl(name);
        return await this.prisma.company.update({
            where: {
                id
            },
            data: {
                name,
                imageUrl
            }
        });
    }

    private getImageUrl(name: string): string {
        return "https://api.dicebear.com/8.x/identicon/svg?seed=" + escapeForUrl(name);
    }
}