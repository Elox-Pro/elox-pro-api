import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { TfaRequestDto } from "@app/tfa/dtos/tfa/tfa.request.dto";
import { TfaType } from "@prisma/client";
import { TfaAction } from "@app/tfa/enums/tfa-action.enum";
import { UpdatePasswordRequestDto } from "../dtos/update-password/update-password-request.dto";
import { UpdatePasswordResponseDto } from "../dtos/update-password/update-password-response.dto";
import { HashingStrategy } from "@app/common/strategies/hashing/hashing.strategy";
import { TfaActionKey } from "@app/tfa/enums/tfa-action-key.enum";
import { EMAIL_QUEUE } from "@app/email/constants/email.constants";
import { EmailProcessorRequestDto } from "@app/email/dtos/email-processor/email-processor.request.dto";
import { EmailType } from "@app/email/enums/email-type.enum";
import { TfaService } from "@app/tfa/services/tfa.service";

@Injectable()
export class UpdatePasswordUC implements IUseCase<UpdatePasswordRequestDto, UpdatePasswordResponseDto> {

    private readonly logger = new Logger(UpdatePasswordUC.name);

    constructor(
        private readonly tfaService: TfaService,
        @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
        private readonly prisma: PrismaService,
        private readonly hashingStrategy: HashingStrategy
    ) { }

    async execute(request: UpdatePasswordRequestDto): Promise<UpdatePasswordResponseDto> {

        const { currentPassword, confirmPassword, newPassword } = request;
        const username = request.getUsername();
        const lang = request.getLang();
        const ip = request.getIp();

        const user = await this.prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            this.logger.error(`User with username ${username} not found`);
            throw new BadRequestException('error.user-not-found');
        }

        if (!await this.hashingStrategy.compare(currentPassword, user.password)) {
            this.logger.error('Invalid password');
            throw new BadRequestException('error.invalid-credentials');
        }

        if (newPassword !== confirmPassword) {
            this.logger.error('Passwords do not match: ' + username);
            throw new BadRequestException('error.passwords-do-not-match');
        }

        const hashedPassword = await this.hashingStrategy.hash(newPassword);

        if (user.tfaType === TfaType.NONE) {

            await this.prisma.user.update({
                where: { username },
                data: { password: hashedPassword }
            });

            await this.emailQueue.add(new EmailProcessorRequestDto(
                EmailType.UPDATE_PASSWORD, user, lang
            ));

            return new UpdatePasswordResponseDto(false);
        }

        const metadata = {
            [TfaActionKey.NEW_HASHED_PASSWORD]: hashedPassword
        } as Record<TfaActionKey, string>;

        const job = await this.tfaService.add(new TfaRequestDto(
            user, ip, TfaAction.UPDATE_PASSWORD, lang, metadata
        ));

        return new UpdatePasswordResponseDto(true, job.id.toString());
    }
}