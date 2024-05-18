import { IUseCase } from "@app/common/usecase/usecase.interface";
import { UpdateGenderResponseDto } from "../dtos/update-gender/update-gender.response.dto";
import { UpdateGenderRequestDto } from "../dtos/update-gender/update-gender.request.dto";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";

@Injectable()
export class UpdateGenderUC implements IUseCase<UpdateGenderRequestDto, UpdateGenderResponseDto> {

    private readonly logger = new Logger(UpdateGenderUC.name);

    constructor(private readonly prisma: PrismaService) { }

    async execute(request: UpdateGenderRequestDto): Promise<UpdateGenderResponseDto> {

        const { gender } = request;
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
                gender
            }
        });

        return new UpdateGenderResponseDto(true);
    }
}