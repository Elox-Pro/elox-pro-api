import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { UpdatePhoneRequestDto } from "../dtos/update-phone/update-phone.request.dto";
import { UpdatePhoneResponseDto } from "../dtos/update-phone/update-phone.response.dto";

@Injectable()
export class UpdatePhoneUC implements IUseCase<UpdatePhoneRequestDto, UpdatePhoneResponseDto> {

    private readonly logger = new Logger(UpdatePhoneUC.name);

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async execute(request: UpdatePhoneRequestDto): Promise<UpdatePhoneResponseDto> {

        const { phone } = request;
        const username = request.getUsername();

        const user = await this.prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            this.logger.error(`User with username ${username} not found`);
            throw new BadRequestException('error.user-not-found');
        }

        if (user.phone === phone) {
            this.logger.error(`User with phone ${phone} already has phone ${phone}`);
            throw new BadRequestException('error.user-already-has-phone');
        }

        const countPhone = await this.prisma.user.count({
            where: { phone }
        });

        if (countPhone > 0) {
            this.logger.error(`Phone ${phone} already exists`);
            throw new BadRequestException('error.phone-already-exists');
        }

        await this.prisma.user.update({
            where: { username },
            data: { phone }
        });

        return new UpdatePhoneResponseDto(true);
    }
}