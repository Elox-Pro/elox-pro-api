import { BadRequestException, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { RecoverPasswordResetRequestDto } from "../dtos/recover-password-reset/recover-password-reset.request.dto";
import { RecoverPasswordResetResponseDto } from "../dtos/recover-password-reset/recover-password-reset.response.dto";
import { IUseCase } from "@app/common/usecase/usecase.interface";
import { HashingStrategy } from "@app/common/strategies/hashing/hashing.strategy";
import { SessionCookieService } from "@app/common/services/session-cookie.service";
import { PrismaService } from "@app/prisma/prisma.service";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { EMAIL_QUEUE } from "@app/email/constants/email.constants";
import { EmailProcessorRequestDto } from "@app/email/dtos/email-processor/email-processor.request.dto";
import { EmailType } from "@app/email/enums/email-type.enum";

/**
 * Use case for recovering and resetting a user's password.
 * It verifies the reset token, updates the password, and deletes the session cookie.
 * @author Yonatan A Quintero R
 * @date 2024-04-01
 */
@Injectable()
export class RecoverPasswordResetUC implements IUseCase<RecoverPasswordResetRequestDto, RecoverPasswordResetResponseDto>{

    private readonly logger = new Logger(RecoverPasswordResetUC.name);

    constructor(
        @InjectQueue(EMAIL_QUEUE)
        private readonly emailQueue: Queue,
        private readonly hashingStrategy: HashingStrategy,
        private readonly sessionCookieService: SessionCookieService,
        private readonly prisma: PrismaService,
    ) { }

    /**
     * Executes the password recovery and reset use case.
     * Verifies the reset token, updates the password, and deletes the session cookie.
     * @param data The recover password reset request data.
     * @returns A promise resolving to a RecoverPasswordResetResponseDto.
     * @throws UnauthorizedException if the token is invalid or missing.
     * @throws BadRequestException if the passwords do not match.
     */
    async execute(data: RecoverPasswordResetRequestDto): Promise<RecoverPasswordResetResponseDto> {

        const { username, password1, password2, lang } = data;

        const token = this.sessionCookieService.get(data.getRequest());

        if (!token) {
            this.logger.error("Token not found: " + username);
            throw new UnauthorizedException("error.invalid-credentials");
        }

        const isValid = await this.hashingStrategy.compare(username, token);

        if (!isValid) {
            this.logger.error("Invalid token: " + username);
            throw new UnauthorizedException("error.invalid-credentials");
        }

        this.sessionCookieService.delete(data.getResponse());

        if (password1 !== password2) {
            this.logger.error('Passwords do not match: ' + username);
            throw new BadRequestException('error.passwords-do-not-match');
        }

        const hashedPassword = await this.hashingStrategy.hash(password1);

        const user = await this.prisma.user.update({
            where: { username: username },
            data: {
                password: hashedPassword,
            }
        })

        await this.emailQueue.add(new EmailProcessorRequestDto(EmailType.WELCOME, user, lang));

        return new RecoverPasswordResetResponseDto(true);
    }
}