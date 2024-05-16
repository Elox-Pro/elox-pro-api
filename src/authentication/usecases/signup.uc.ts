import { IUseCase } from "@app/common/usecase/usecase.interface";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { SignupRequestDto } from "../dtos/signup/signup.request.dto";
import { SignupResponseDto } from "../dtos/signup/signup.response.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { HashingStrategy } from "../../common/strategies/hashing/hashing.strategy";
import { TfaRequestDto } from "../../tfa/dtos/tfa/tfa.request.dto";
import { TfaAction } from "../../tfa/enums/tfa-action.enum";
import { TfaService } from "@app/tfa/services/tfa.service";

@Injectable()
export class SignupUC implements IUseCase<SignupRequestDto, SignupResponseDto> {

    private readonly logger = new Logger(SignupUC.name);

    constructor(
        private readonly tfaService: TfaService,
        private readonly prisma: PrismaService,
        private readonly hashingStrategy: HashingStrategy
    ) { }

    async execute(request: SignupRequestDto): Promise<SignupResponseDto> {

        const ip = request.getIp();
        const lang = request.getLang();

        const usernameCount = await this.prisma.user.count({ where: { username: request.username } });
        if (usernameCount > 0) {
            this.logger.error(`Username already exists: ${request.username}`);
            throw new BadRequestException('error.username-already-exists');
        }

        const emailCount = await this.prisma.user.count({ where: { email: request.email } });
        if (emailCount > 0) {
            this.logger.error(`Email already exists: ${request.email}`);
            throw new BadRequestException('error.email-already-exists');
        }

        if (request.password1 !== request.password2) {
            this.logger.error('Passwords do not match');
            throw new BadRequestException('error.passwords-do-not-match');
        }

        const hashedPassword = await this.hashingStrategy.hash(request.password1);

        const savedUser = await this.prisma.user.create({
            data: {
                username: request.username,
                email: request.email,
                password: hashedPassword,
            }
        });

        const job = await this.tfaService.add(new TfaRequestDto(
            savedUser, ip, TfaAction.SIGN_UP, lang
        ));

        return new SignupResponseDto(true, job.id.toString());
    }
}