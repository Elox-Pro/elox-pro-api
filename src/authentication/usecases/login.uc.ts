import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { LoginRequestDto } from "authentication/dtos/login.request.dto";
import { IUseCase } from "common/usecase/usecase.interface";
import { JwtAccessPayloadDto } from "../dtos/jwt-access-payload.dto";
import { LoginResponseDto } from "../dtos/login.response.dto";
import { PrismaService } from "prisma//prisma.service";
import { HashingStrategy } from "../strategies/hashing/hashing.strategy";
import { TFAResponseDto } from "../dtos/tfa.response.dto";
import { TFA_STRATEGY_QUEUE } from "../constants/authentication.constants";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { TfaType } from "@prisma/client";
import { JwtStrategy } from "../strategies/jwt/jwt.strategy";

@Injectable()
export class LoginUC implements IUseCase<LoginRequestDto, LoginResponseDto> {

    private readonly logger = new Logger(LoginUC.name);

    constructor(
        @InjectQueue(TFA_STRATEGY_QUEUE)
        private readonly tfaStrategyQueue: Queue,
        private readonly prisma: PrismaService,
        private readonly hashingStrategy: HashingStrategy,
        private readonly jwtStrategy: JwtStrategy
    ) { }

    async execute(login: LoginRequestDto): Promise<LoginResponseDto> {

        const savedUser = await this.prisma.user.findUnique({
            where: { username: login.username }
        });

        if (!savedUser) {
            this.logger.error(`username not found: ${login.username}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!await this.hashingStrategy.compare(login.password, savedUser.password)) {
            this.logger.error('Invalid password');
            throw new UnauthorizedException('Invalid credentials');
        }

        if (savedUser.tfaType === TfaType.NONE) {
            const tokens = await this.jwtStrategy.generate(
                new JwtAccessPayloadDto(savedUser.username, savedUser.role)
            );
            return new LoginResponseDto(false, tokens);
        }

        await this.tfaStrategyQueue.add(new TFAResponseDto(savedUser, login.ipClient));
        return new LoginResponseDto(true, null);
    }
}