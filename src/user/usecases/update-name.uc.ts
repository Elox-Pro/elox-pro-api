import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { UpdateNameRequestDto } from "../dtos/update-name/update-name.request.dto";
import { UpdateNameResponseDto } from "../dtos/update-name/update-name.responde.dto";
import { PrismaService } from "@app/prisma/prisma.service";

@Injectable()
export class UpdateNameUC implements IUseCase<UpdateNameRequestDto, UpdateNameResponseDto> {

    private readonly logger = new Logger(UpdateNameUC.name);

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async execute(request: UpdateNameRequestDto): Promise<UpdateNameResponseDto> {

        const { firstName, lastName } = request;
        const username = request.getUsername();

        const user = await this.prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            this.logger.error(`User ${username} not found`);
            throw new BadRequestException('error.user-not-found');
        }

        await this.prisma.user.update({
            where: { username },
            data: {
                firstName,
                lastName
            }
        });

        return new UpdateNameResponseDto(true);
    }
}