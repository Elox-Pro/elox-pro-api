import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "src/authentication/dtos/login.dto";
import { IUseCase } from "src/common/usecase/usecase.interface";
import { JwtOutputDto } from "../dtos/jwt-output.dto";
import { LoginResponseDto } from "../dtos/login-response.dto";
import { PrismaService } from "src/prisma//prisma.service";
import { HashingStrategy } from "../strategies/hashing/hashing.strategy";
import { TfaDto } from "../dtos/tfa.dto";
import { TFA_STRATEGY_QUEUE } from "../constants/authentication.constant";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { TfaType } from "@prisma/client";

@Injectable()
export class LoginUC implements IUseCase<LoginDto, LoginResponseDto> {

    constructor(
        private prisma: PrismaService,
        private hashingService: HashingStrategy,
        @InjectQueue(TFA_STRATEGY_QUEUE)
        private readonly tfaStrategyQueue: Queue
    ) { }

    async execute(login: LoginDto): Promise<LoginResponseDto> {

        const savedUser = await this.prisma.user.findUnique({
            where: { username: login.username }
        });

        if (!savedUser) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!this.hashingService.compare(login.password, savedUser.password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (savedUser.tfaType === TfaType.NONE) {
            // Generate tokens
            return new LoginResponseDto(new JwtOutputDto(null, null), false);
        }

        await this.tfaStrategyQueue.add(new TfaDto(savedUser, login.ipClient));
        return new LoginResponseDto(null, true);
    }
}