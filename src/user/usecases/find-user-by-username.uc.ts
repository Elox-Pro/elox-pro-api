import { IUseCase } from "@app/common/usecase/usecase.interface";
import { FindUserByUsernameRequestDto } from "../dtos/find-user-by-username/find-user-by-username.request.dto";
import { FindUserByUserNameResponseDto } from "../dtos/find-user-by-username/find-user-by-username.response.dto";
import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { UserTranslator } from "../translate/user.translate";
import { getUserLang } from "@app/common/helpers/get-user-lang.helper";

/**
 * Use case for finding a user by username.
 * @author Yonatan A Quintero R
 * @date 2024-02-03
 */
@Injectable()
export class FindUserByUsernameUC implements IUseCase<FindUserByUsernameRequestDto, FindUserByUserNameResponseDto> {

    constructor(
        private prisma: PrismaService,
        private userTranslator: UserTranslator
    ) { }

    /**
     * Executes the find user by username use case.
     * Verifies if the user exists, and returns the found user.
     * @param data The usecase request data.
     * @returns A promise resolving to a FindUserByUsernameResponseDto.
     * @throws BadRequestException if the user does not exist.
     */
    async execute(
        data: FindUserByUsernameRequestDto
    ): Promise<FindUserByUserNameResponseDto> {

        const username = data.getUsername();
        const { lang } = data;
        const user = await this.prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            throw new BadRequestException('error.user-not-found');
        }

        const userTranslations = await this.userTranslator.translate(
            user, getUserLang(lang, user.lang)
        );

        return new FindUserByUserNameResponseDto(user, userTranslations);
    }
}