import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { UpdateEmailRequestDto } from "../dtos/update-email/update-email-request.dto";
import { UpdateEmailResponseDto } from "../dtos/update-email/update-email-response.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { TfaRequestDto } from "@app/tfa/dtos/tfa/tfa.request.dto";
import { TfaType } from "@prisma/client";
import { TfaAction } from "@app/tfa/enums/tfa-action.enum";
import { TfaActionKey } from "@app/tfa/enums/tfa-action-key.enum";
import { TfaQueueService } from "@app/tfa/services/tfa-queue.service";

@Injectable()
export class UpdateEmailUC implements IUseCase<UpdateEmailRequestDto, UpdateEmailResponseDto> {

    private readonly logger = new Logger(UpdateEmailUC.name);

    constructor(
        private readonly queue: TfaQueueService,
        private readonly prisma: PrismaService,
    ) { }

    async execute(request: UpdateEmailRequestDto): Promise<UpdateEmailResponseDto> {

        const { email } = request;
        const username = request.getUsername();
        const lang = request.getLang();
        const ip = request.getIp();

        const user = await this.prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            this.logger.error(`User ${username} not found`);
            throw new BadRequestException('error.user-not-found');
        }

        if (user.email === email) {
            this.logger.error(`User ${username} already has email ${email}`);
            throw new BadRequestException('error.user-already-has-email');
        }

        const countEmail = await this.prisma.user.count({
            where: { email }
        });

        if (countEmail > 0) {
            this.logger.error(`Email ${email} already exists`);
            throw new BadRequestException('error.email-already-exists');
        }

        // Change the user email and tfa-type to send the two factor authentication code by email
        user.email = email;
        user.tfaType = TfaType.EMAIL;

        const metadata = {
            [TfaActionKey.NEW_EMAIL]: email,
        } as Record<TfaActionKey, string>;

        const job = await this.queue.add(new TfaRequestDto(
            user, ip, TfaAction.UPDATE_EMAIL, lang, metadata
        ));

        return new UpdateEmailResponseDto(true, job.id.toString());
    }
}