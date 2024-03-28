import { IUseCase } from "@app/common/usecase/usecase.interface";
import { ValidateTFARequestDto } from "../dtos/validate-tfa/validate-tfa.request.dto";
import { ValidateTFAResponseDto } from "../dtos/validate-tfa/validate-tfa.response.dto";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { JwtStrategy } from "../../jwt-app/strategies/jwt.strategy";
import { TfaFactory } from "../factories/tfa.factory";
import { JwtAccessPayloadDto } from "../../jwt-app/dtos/jwt/jwt-access-payload.dto";
import { JwtCookieService } from "@app/jwt-app/services/jwt-cookie.service";
import { ActiveUserDto } from "@app/authorization/dto/active-user.dto";
import { TfaAction } from "../enums/tfa-action.enum";
import { TfaType } from "@prisma/client";
import { EMAIL_QUEUE } from "@app/email/constants/email.constants";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { EmailProcessorRequestDto } from "@app/email/dtos/email-processor/email-processor.request.dto";
import { EmailType } from "@app/email/enums/email-type.enum";

@Injectable()
export class ValidateTfaUC implements IUseCase<ValidateTFARequestDto, ValidateTFAResponseDto>{

    private readonly logger = new Logger(ValidateTfaUC.name);

    constructor(
        @InjectQueue(EMAIL_QUEUE)
        private readonly emailQueue: Queue,
        private readonly prisma: PrismaService,
        private readonly tfaFactory: TfaFactory,
        private readonly jwtStrategy: JwtStrategy,
        private readonly jwtCookieService: JwtCookieService
    ) { }

    async execute(data: ValidateTFARequestDto): Promise<ValidateTFAResponseDto> {

        const savedUser = await this.prisma.user.findUnique({
            where: { username: data.username }
        });

        if (!savedUser) {
            this.logger.error(`Username not found: ${data.username}`);
            throw new UnauthorizedException('error.invalid-credentials');
        }

        const strategy = this.tfaFactory.getTfaStrategy(savedUser.tfaType);

        if (!strategy) {
            this.logger.error('Tfa strategy is required');
            throw new UnauthorizedException('error.invalid-credentials');
        }

        const { result, action } = await strategy.verify(
            savedUser.username,
            data.code.toString()
        );

        if (!result) {
            this.logger.error('Invalid code');
            throw new UnauthorizedException('error.invalid-credentials');
        }

        // TODO: Refactor code into strategy pattern
        if (action === TfaAction.SIGN_UP) {
            const type = savedUser.tfaType;
            await this.prisma.user.update({
                where: { id: savedUser.id },
                data: {
                    emailVerified: type === TfaType.EMAIL,
                    phoneVerified: type === TfaType.SMS,
                }
            });

            await this.emailQueue.add(new EmailProcessorRequestDto(
                EmailType.WELCOME,
                savedUser,
                data.lang
            ));

            return new ValidateTFAResponseDto(type, action);
        }

        if (action === TfaAction.SIGN_IN) {

            const payload = new JwtAccessPayloadDto(savedUser.username, savedUser.role)
            const activeUser = new ActiveUserDto(payload.sub, payload.role, true);
            const tokens = await this.jwtStrategy.generate(payload);
            this.jwtCookieService.createSession(data.getResponse(), tokens, activeUser);

            return new ValidateTFAResponseDto(savedUser.tfaType, action);
        }

    }

}