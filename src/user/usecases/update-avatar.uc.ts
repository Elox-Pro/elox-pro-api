import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { UpdateAvatarRequestDto } from "../dtos/update-avatar/update-avatar.request.dto";
import { UpdateAvatarResponseDto } from "../dtos/update-avatar/update-avatar.response.dto";
import { PrismaService } from "@app/prisma/prisma.service";

@Injectable()
export class UpdateAvatarUC implements IUseCase<UpdateAvatarRequestDto, UpdateAvatarResponseDto> {

    private readonly logger = new Logger(UpdateAvatarUC.name);

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async execute(request: UpdateAvatarRequestDto): Promise<UpdateAvatarResponseDto> {

        const username = request.getUsername();

        const user = await this.prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            this.logger.error(`User ${username} not found`);
            throw new BadRequestException('error.user-not-found');
        }

        const { avatarUrl } = request;

        await this.prisma.user.update({
            where: { username },
            data: {
                avatarUrl
            }
        });

        return new UpdateAvatarResponseDto(true);
    }
}