import { IUseCase } from "@app/common/usecase/usecase.interface";
import { GetProfileRequestDto } from "../dtos/get-profile.request.dto";
import { GetProfileResponseDto } from "../dtos/get-profile.response.dto";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";

@Injectable()
export class GetProfileUC implements IUseCase<GetProfileRequestDto, GetProfileResponseDto> {

    constructor(private prisma: PrismaService) { }

    async execute(data: GetProfileRequestDto): Promise<GetProfileResponseDto> {

        const { username } = data;
        const user = await this.prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        return new GetProfileResponseDto(user);
    }
}