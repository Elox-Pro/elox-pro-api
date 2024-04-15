import { IUseCase } from "@app/common/usecase/usecase.interface";
import { Injectable } from "@nestjs/common";
import { FindManyAvatarsResponsetDto } from "../dto/find-many-avatars/find-many-avatars.response.dto";
import { PrismaService } from "@app/prisma/prisma.service";

/**
 * Use case for find many avatars
 * @author Yonatan A Quintero R
 * @date 2024-04-15
 */
@Injectable()
export class FindManyAvatarsUC implements IUseCase<void, FindManyAvatarsResponsetDto> {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    /**
     * Executes the Find many avatars use case.
     * @returns A promise resolving to a FindManyAvatarResponseDto.
     */
    async execute(): Promise<FindManyAvatarsResponsetDto> {
        const avatars = await this.prisma.avatar.findMany();
        return new FindManyAvatarsResponsetDto(avatars);
    }
}