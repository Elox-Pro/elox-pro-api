import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { SignupRequestDto } from "../dtos/signup/signup.request.dto";
import { SignupResponseDto } from "../dtos/signup/signup.response.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { HashingStrategy } from "../../common/strategies/hashing/hashing.strategy";
import { Queue } from "bull";
import { TFA_STRATEGY_QUEUE } from "@app/tfa/constants/tfa.constants";
import { InjectQueue } from "@nestjs/bull";
import { TfaRequestDto } from "../../tfa/dtos/tfa/tfa.request.dto";
import { TfaAction } from "../../tfa/enums/tfa-action.enum";

@Injectable()
export class SignupUC implements IUseCase<SignupRequestDto, SignupResponseDto>{

    private readonly logger = new Logger(SignupUC.name);

    constructor(
        @InjectQueue(TFA_STRATEGY_QUEUE)
        private readonly tfaStrategyQueue: Queue,
        private readonly prisma: PrismaService,
        private readonly hashingStrategy: HashingStrategy
    ) { }

    async execute(data: SignupRequestDto): Promise<SignupResponseDto> {

        const usernameCount = await this.prisma.user.count({ where: { username: data.username } });
        if (usernameCount > 0) {
            this.logger.error(`Username already exists: ${data.username}`);
            throw new BadRequestException('error.username-already-exists');
        }

        const emailCount = await this.prisma.user.count({ where: { email: data.email } });
        if (emailCount > 0) {
            this.logger.error(`Email already exists: ${data.email}`);
            throw new BadRequestException('error.email-already-exists');
        }

        if (data.password1 !== data.password2) {
            this.logger.error('Passwords do not match');
            throw new BadRequestException('error.passwords-do-not-match');
        }

        const hashedPassword = await this.hashingStrategy.hash(data.password1);

        const savedUser = await this.prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
            }
        });

        await this.tfaStrategyQueue.add(new TfaRequestDto(
            savedUser, data.ipClient, TfaAction.SIGN_UP, data.lang
        ));

        return new SignupResponseDto(true);
    }
}