import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { SetCompanyNameResponseDto } from "../dtos/set-company-name/set-company-name.response.dto";
import { SetCompanyNameRequestDto } from "../dtos/set-company-name/set-company-name.request.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { Company } from "@prisma/client";
import { escapeForUrl } from "@app/common/helpers/escape-for-url.helper";

@Injectable()
export class SetCompanyNameUC implements IUseCase<SetCompanyNameRequestDto, SetCompanyNameResponseDto> {

    private readonly logger = new Logger(SetCompanyNameUC.name);

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async execute(request: SetCompanyNameRequestDto): Promise<SetCompanyNameResponseDto> {

        const { name, id } = request;

        try {

            if (id > 0) {
                await this.update(id, name);
            } else {
                await this.create(name);
            }

            return new SetCompanyNameResponseDto(true);

        } catch (error) {
            throw error;
        }
    }

    private async create(name: string) {
        if (await this.existsCompanyByName(name)) {
            this.logger.error(`Company already exists: ${name}`);
            throw new BadRequestException('error.company-already-exists');
        }
        await this.createCompany(name);

    }

    private async update(id: number, name: string) {

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

        await this.updateName(id, name);

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

    private async createCompany(name: string): Promise<Company> {
        const imageUrl = this.getImageUrl(name);
        return await this.prisma.company.create({
            data: {
                name,
                imageUrl
            }
        });
    }

    private async updateName(id: number, name: string): Promise<Company> {
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