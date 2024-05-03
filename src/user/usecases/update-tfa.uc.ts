import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { UpdateTfaRequestDto } from "../dtos/update-tfa/update-tfa.request.dto";
import { UpdateTfaResponseDto } from "../dtos/update-tfa/update-tfa.response.dto";
import { TfaType } from "@prisma/client";

@Injectable()
export class UpdateTfaUC implements IUseCase<UpdateTfaRequestDto, UpdateTfaResponseDto> {

    private readonly logger = new Logger(UpdateTfaUC.name);

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async execute(request: UpdateTfaRequestDto): Promise<UpdateTfaResponseDto> {

        const { tfaType } = request;
        const username = request.getUsername();

        const user = await this.prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            this.logger.error(`User ${username} not found`);
            throw new BadRequestException('error.user-not-found');
        }

        if (tfaType === TfaType.EMAIL && !user.emailVerified) {
            this.logger.error(`Email ${user.email} not verified`);
            throw new BadRequestException('error.email-not-verified');
        }

        await this.prisma.user.update({
            where: { username },
            data: { tfaType }
        });

        return new UpdateTfaResponseDto(true);
    }
}