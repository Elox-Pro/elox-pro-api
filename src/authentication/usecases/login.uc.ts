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
import JWTCookieService from "../services/jwt-cookie.service";

/**
 * Use case for handling user login.
 * It verifies credentials, generates JWT tokens, and manages session cookies.
 * If TFA is enabled, it adds a job to the TFA strategy queue.
 * @author yonax73@gmail.com
 * @date 2024-02-07
 */
@Injectable()
export class LoginUC implements IUseCase<LoginRequestDto, LoginResponseDto> {

    private readonly logger = new Logger(LoginUC.name);

    constructor(
        @InjectQueue(TFA_STRATEGY_QUEUE)
        private readonly tfaStrategyQueue: Queue,
        private readonly prisma: PrismaService,
        private readonly hashingStrategy: HashingStrategy,
        private readonly jwtStrategy: JwtStrategy,
        private readonly jwtCookieService: JWTCookieService
    ) { }

    /**
     * Executes the login use case.
     * Verifies user credentials, generates JWT tokens, and manages session cookies.
     * If TFA is enabled, adds a job to the TFA strategy queue.
     * @param login The login request data.
     * @returns A promise resolving to a LoginResponseDto.
     * @throws UnauthorizedException if login credentials are invalid.
     */
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
            const payload = new JwtAccessPayloadDto(savedUser.username, savedUser.role)
            const tokens = await this.jwtStrategy.generate(payload);
            this.jwtCookieService.createSession(login.getResponse(), tokens, payload);
            return new LoginResponseDto(false, null);
        }

        await this.tfaStrategyQueue.add(new TFAResponseDto(savedUser, login.ipClient));
        return new LoginResponseDto(true, null);
    }
}
