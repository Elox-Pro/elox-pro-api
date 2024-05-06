import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { RecoverPasswordInitRequestDto } from "../dtos/recover-password-init/recover-password-init.request.dto";
import { RecoverPasswordInitResponseDto } from "../dtos/recover-password-init/recover-password-init.response.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { isVerifiedUser } from "@app/common/helpers/is-verified-user";
import { TFA_STRATEGY_QUEUE } from "@app/tfa/constants/tfa.constants";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { TfaRequestDto } from "@app/tfa/dtos/tfa/tfa.request.dto";
import { TfaAction } from "@app/tfa/enums/tfa-action.enum";

@Injectable()
export class RecoverPasswordInitUC implements IUseCase<RecoverPasswordInitRequestDto, RecoverPasswordInitResponseDto> {

    private readonly logger = new Logger(RecoverPasswordInitUC.name);

    constructor(
        @InjectQueue(TFA_STRATEGY_QUEUE)
        private readonly tfaStrategyQueue: Queue,
        private readonly prisma: PrismaService,
    ) { }

    async execute(data: RecoverPasswordInitRequestDto): Promise<RecoverPasswordInitResponseDto> {

        const { username } = data;
        const user = await this.prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            this.logger.error(`User ${username} not found`);
            throw new BadRequestException('error.username-not-found');
        }

        if (!isVerifiedUser(user)) {
            this.logger.error(`User ${username} not verified`);
            throw new BadRequestException('error.user-not-verified');
        }

        await this.tfaStrategyQueue.add(new TfaRequestDto(
            user, data.ipClient, TfaAction.RECOVER_PASSWORD, data.lang
        ));

        return new RecoverPasswordInitResponseDto(true);
    }
}