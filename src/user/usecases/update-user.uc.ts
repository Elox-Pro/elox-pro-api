import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable } from "@nestjs/common";
import { UpdateUserRequestDto } from "../dtos/update-user/update-user.request.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { UpdateUserResponseDto } from "../dtos/update-user/update-user.response.dto";

/**
 * Use case for updating a user by username.
 * @author Yonatan A Quintero R
 * @date 2024-02-06
 */
@Injectable()
export class UpdateUserUC implements IUseCase<UpdateUserRequestDto, UpdateUserResponseDto> {

    constructor(private prisma: PrismaService) { }

    /**
     * It executes the update user use case.
     * Verifies if the user exists, and updates the user.
     * @param request The usecase request data.
     * @returns A promise resolving to an UpdateUserResponseDto.
     * @throws BadRequestException if the user does not exist.
     */
    async execute(request: UpdateUserRequestDto): Promise<UpdateUserResponseDto> {

        const { firstName, lastName, gender } = request;

        const username = request.getUsername();

        const savedUser = await this.prisma.user.findUnique({
            where: { username }
        });

        if (!savedUser) {
            throw new BadRequestException('error.user-not-found');
        }

        await this.prisma.user.update({
            where: { username },
            data: {
                firstName,
                lastName,
                gender
            },
        });

        return new UpdateUserResponseDto(true);
    }
}