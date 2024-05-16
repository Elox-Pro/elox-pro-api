import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { RecoverPasswordInitRequestDto } from "../dtos/recover-password-init/recover-password-init.request.dto";
import { RecoverPasswordInitResponseDto } from "../dtos/recover-password-init/recover-password-init.response.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { isVerifiedUser } from "@app/common/helpers/is-verified-user";
import { TfaRequestDto } from "@app/tfa/dtos/tfa/tfa.request.dto";
import { TfaAction } from "@app/tfa/enums/tfa-action.enum";
import { TfaService } from "@app/tfa/services/tfa.service";

@Injectable()
export class RecoverPasswordInitUC implements IUseCase<RecoverPasswordInitRequestDto, RecoverPasswordInitResponseDto> {

    private readonly logger = new Logger(RecoverPasswordInitUC.name);

    constructor(
        private readonly tfaService: TfaService,
        private readonly prisma: PrismaService,
    ) { }

    async execute(request: RecoverPasswordInitRequestDto): Promise<RecoverPasswordInitResponseDto> {

        const ip = request.getIp();
        const lang = request.getLang();
        const { username } = request;
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

        const job = await this.tfaService.add(new TfaRequestDto(
            user, ip, TfaAction.RECOVER_PASSWORD, lang
        ));

        return new RecoverPasswordInitResponseDto(true, job.id.toString());
    }
}