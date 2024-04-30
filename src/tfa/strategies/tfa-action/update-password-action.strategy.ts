import { Injectable } from "@nestjs/common";
import { TfaActionStrategy } from "./tfa-action.strategy";
import { ValidateTFARequestDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.request.dto";
import { ValidateTFAResponseDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.response.dto";
import { User } from "@prisma/client";
import { EMAIL_QUEUE } from "@app/email/constants/email.constants";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { PrismaService } from "@app/prisma/prisma.service";
import { EmailProcessorRequestDto } from "@app/email/dtos/email-processor/email-processor.request.dto";
import { EmailType } from "@app/email/enums/email-type.enum";
import { TfaAction } from "@app/tfa/enums/tfa-action.enum";
import { TfaActionKey } from "@app/tfa/enums/tfa-action-key.enum";

@Injectable()
export class UpdatePasswordTfaActionStrategy extends TfaActionStrategy {

    constructor(
        private readonly prisma: PrismaService,
        @InjectQueue(EMAIL_QUEUE)
        private readonly emailQueue: Queue
    ) {
        super();
    }

    async execute(
        data: ValidateTFARequestDto,
        user: User,
        metadata: Record<string, string>
    ): Promise<ValidateTFAResponseDto> {

        if (!metadata) {
            throw new Error('Missing metadata');
        }

        const newPassword = metadata[TfaActionKey.NEW_HASHED_PASSWORD];

        if (!newPassword) {
            throw new Error('Missing update-email metadata');
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: newPassword
            },
        });

        await this.emailQueue.add(new EmailProcessorRequestDto(
            EmailType.UPDATE_PASSWORD, updatedUser, data.lang
        ));

        return new ValidateTFAResponseDto(user.tfaType, TfaAction.UPDATE_PASSWORD);
    }

}