import { Injectable } from "@nestjs/common";
import { TfaActionStrategy } from "./tfa-action.strategy";
import { ValidateTFARequestDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.request.dto";
import { ValidateTFAResponseDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.response.dto";
import { User } from "@prisma/client";
import { PrismaService } from "@app/prisma/prisma.service";
import { EmailProcessorRequestDto } from "@app/email/dtos/email-processor/email-processor.request.dto";
import { EmailType } from "@app/email/enums/email-type.enum";
import { TfaAction } from "@app/tfa/enums/tfa-action.enum";
import { TfaActionKey } from "@app/tfa/enums/tfa-action-key.enum";
import { EmailQueueService } from "@app/email/services/email-queue.service";

@Injectable()
export class UpdateEmailTfaActionStrategy extends TfaActionStrategy {

    constructor(
        private readonly prisma: PrismaService,
        private readonly queue: EmailQueueService
    ) {
        super();
    }

    async execute(
        request: ValidateTFARequestDto,
        user: User,
        metadata: Record<string, string>
    ): Promise<ValidateTFAResponseDto> {

        if (!metadata) {
            throw new Error('Missing metadata');
        }

        const updateEmail = metadata[TfaActionKey.NEW_EMAIL];

        if (!updateEmail) {
            throw new Error('Missing update-email metadata');
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                email: updateEmail,
            },
        });

        await this.queue.add(new EmailProcessorRequestDto(
            EmailType.UPDATE_EMAIL, updatedUser, request.getLang()
        ));

        return new ValidateTFAResponseDto(user.tfaType, TfaAction.UPDATE_EMAIL);
    }
}