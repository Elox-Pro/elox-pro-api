import { IUseCase } from "@app/common/usecase/usecase.interface";
import { ValidateTFARequestDto } from "../dtos/validate-tfa/validate-tfa.request.dto";
import { ValidateTFAResponseDto } from "../dtos/validate-tfa/validate-tfa.response.dto";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { TfaFactory } from "../factories/tfa.factory";
import { getDefaultTfaType } from "@app/common/helpers/get-default-tfa-type";
import { TfaActionFactory } from "../factories/tfa-action.factory";

@Injectable()
export class ValidateTfaUC implements IUseCase<ValidateTFARequestDto, ValidateTFAResponseDto> {

    private readonly logger = new Logger(ValidateTfaUC.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly tfaFactory: TfaFactory,
        private readonly tfaActionFactory: TfaActionFactory
    ) { }

    async execute(request: ValidateTFARequestDto): Promise<ValidateTFAResponseDto> {

        const savedUser = await this.prisma.user.findUnique({
            where: { username: request.username }
        });

        if (!savedUser) {
            this.logger.error(`Username not found: ${request.username}`);
            throw new BadRequestException('error.invalid-credentials');
        }

        const type = getDefaultTfaType(savedUser.tfaType);
        const strategy = this.tfaFactory.createStrategy(type);

        const { result, action, metadata } = await strategy.verify(
            savedUser.username,
            request.code.toString()
        );

        if (!result) {
            this.logger.error('Invalid code');
            throw new BadRequestException('error.invalid-credentials');
        }

        const actionStrategy = this.tfaActionFactory.createStrategy(action);
        return await actionStrategy.execute(request, savedUser, metadata);
    }
}