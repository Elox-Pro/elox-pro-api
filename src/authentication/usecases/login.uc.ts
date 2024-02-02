import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "authentication/dtos/login.dto";
import { IUseCase } from "common/usecase/usecase.interface";
import { JwtOutputDto } from "../dtos/jwt-output.dto";
import { LoginResponseDto } from "../dtos/login-response.dto";
import { PrismaService } from "prisma//prisma.service";
import { HashingStrategy } from "../strategies/hashing/hashing.strategy";
import { TfaDto } from "../dtos/tfa.dto";
import { TFA_STRATEGY_QUEUE } from "../constants/authentication.constants";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { TfaType } from "@prisma/client";
import { JwtStrategy } from "../strategies/jwt/jwt.strategy";
import { JwtInputDto } from "../dtos/jwt-input.dto";

@Injectable()
export class LoginUC implements IUseCase<LoginDto, LoginResponseDto> {

    constructor(
        @InjectQueue(TFA_STRATEGY_QUEUE)
        private readonly tfaStrategyQueue: Queue,
        private prisma: PrismaService,
        private hashingService: HashingStrategy,
        private jwtStrategy: JwtStrategy
    ) { }

    async execute(login: LoginDto): Promise<LoginResponseDto> {

        const savedUser = await this.prisma.user.findUnique({
            where: { username: login.username }
        });

        if (!savedUser) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!await this.hashingService.compare(login.password, savedUser.password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (savedUser.tfaType === TfaType.NONE) {
            const tokens = await this.jwtStrategy.generate(new JwtInputDto(
                savedUser.id,
                savedUser.role,
                savedUser.username)
            );
            return new LoginResponseDto(
                new JwtOutputDto(tokens.accessToken, tokens.refreshToken),
                false
            );
        }

        await this.tfaStrategyQueue.add(new TfaDto(savedUser, login.ipClient));
        return new LoginResponseDto(null, true);
    }
}