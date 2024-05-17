import { Injectable } from "@nestjs/common";
import { TfaActionStrategy } from "./tfa-action.strategy";
import { ValidateTFARequestDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.request.dto";
import { ValidateTFAResponseDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.response.dto";
import { TfaType, User } from "@prisma/client";
import { PrismaService } from "@app/prisma/prisma.service";
import { EmailProcessorRequestDto } from "@app/email/dtos/email-processor/email-processor.request.dto";
import { EmailType } from "@app/email/enums/email-type.enum";
import { TfaAction } from "@app/tfa/enums/tfa-action.enum";
import { EmailQueueService } from "@app/email/services/email-queue.service";

@Injectable()
export class SignUpTfaActionStrategy extends TfaActionStrategy {

    constructor(
        private readonly prisma: PrismaService,
        private readonly queue: EmailQueueService
    ) {
        super();
    }

    async execute(request: ValidateTFARequestDto, user: User): Promise<ValidateTFAResponseDto> {
        const type = user.tfaType;
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: type === TfaType.EMAIL || type === TfaType.NONE,
                phoneVerified: type === TfaType.SMS,
            },
        });
        await this.queue.add(new EmailProcessorRequestDto(EmailType.WELCOME, user, request.getLang()));
        return new ValidateTFAResponseDto(type, TfaAction.SIGN_UP);
    }

}