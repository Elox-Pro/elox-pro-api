import { Injectable } from "@nestjs/common";
import { TfaActionStrategy } from "./tfa-action.strategy";
import { ValidateTFARequestDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.request.dto";
import { ValidateTFAResponseDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.response.dto";
import { TfaType, User } from "@prisma/client";
import { EMAIL_QUEUE } from "@app/email/constants/email.constants";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { PrismaService } from "@app/prisma/prisma.service";
import { EmailProcessorRequestDto } from "@app/email/dtos/email-processor/email-processor.request.dto";
import { EmailType } from "@app/email/enums/email-type.enum";
import { TfaAction } from "@app/tfa/enums/tfa-action.enum";

@Injectable()
export class SignUpTfaActionStrategy extends TfaActionStrategy {

    constructor(
        private readonly prisma: PrismaService,
        @InjectQueue(EMAIL_QUEUE)
        private readonly emailQueue: Queue
    ) {
        super();
    }

    async execute(data: ValidateTFARequestDto, user: User): Promise<ValidateTFAResponseDto> {
        const type = user.tfaType;
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: type === TfaType.EMAIL,
                phoneVerified: type === TfaType.SMS,
            },
        });
        await this.emailQueue.add(new EmailProcessorRequestDto(EmailType.WELCOME, user, data.lang));
        return new ValidateTFAResponseDto(type, TfaAction.SIGN_UP);
    }

}