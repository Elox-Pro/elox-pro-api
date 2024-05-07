import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { LoginRequestDto } from "authentication/dtos/login/login.request.dto";
import { IUseCase } from "common/usecase/usecase.interface";
import { LoginResponseDto } from "../dtos/login/login.response.dto";
import { PrismaService } from "prisma//prisma.service";
import { HashingStrategy } from "../../common/strategies/hashing/hashing.strategy";
import { TfaRequestDto } from "../../tfa/dtos/tfa/tfa.request.dto";
import { TFA_STRATEGY_QUEUE } from "@app/tfa/constants/tfa.constants";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { TfaType } from "@prisma/client";
import { TfaAction } from "../../tfa/enums/tfa-action.enum";
import { isVerifiedUser } from "../../common/helpers/is-verified-user";
import { JwtCookieSessionService } from "../../jwt-app/services/jwt-cookie-session.service";

/**
 * Use case for handling user login.
 * It verifies credentials, generates JWT tokens, and manages session cookies.
 * If TFA is enabled, it adds a job to the TFA strategy queue.
 * @author Yonatan A Quintero R
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
        private readonly jwtCookieSessionService: JwtCookieSessionService,
    ) { }

    /**
     * Executes the login use case.
     * Verifies user credentials, generates JWT tokens, and manages session cookies.
     * If TFA is enabled, adds a job to the TFA strategy queue.
     * @param request The login request data.
     * @returns A promise resolving to a LoginResponseDto.
     * @throws BadRequestException if login credentials are invalid.
     */
    async execute(request: LoginRequestDto): Promise<LoginResponseDto> {

        const ip = request.getIp();
        const lang = request.getLang();

        // 1. Find the user by username
        const savedUser = await this.prisma.user.findUnique({
            where: { username: request.username },
        });

        // 2. Check if user exists
        if (!savedUser) {
            this.logger.error(`username not found: ${request.username}`);
            throw new BadRequestException('error.invalid-credentials');
        }

        // 3. Validate password
        if (!await this.hashingStrategy.compare(request.password, savedUser.password)) {
            this.logger.error('Invalid password');
            throw new BadRequestException('error.invalid-credentials');
        }

        // 4. Check if Two-Factor Authentication (TFA) is required for this user
        if (savedUser.tfaType === TfaType.NONE) {

            // 4.1 No TFA required, generate access tokens and set session cookie
            await this.jwtCookieSessionService.create(
                request.getResponse(),
                savedUser
            );
            return new LoginResponseDto(false); // Indicates no further action needed
        }


        // 5. User requires TFA but hasn't verified email or phone (applicable for EMAIL or SMS TFA)
        if (!isVerifiedUser(savedUser)) {
            this.logger.warn(`User not verified: ${savedUser.username}`);

            await this.tfaStrategyQueue.add(new TfaRequestDto(
                savedUser, ip, TfaAction.SIGN_UP, lang // Treat login like a sign-up for verification
            ));

            return new LoginResponseDto(true); // Indicates verification required
        }

        // 6. Queue a TFA request for sign-in verification (assuming TFA is enabled)
        await this.tfaStrategyQueue.add(new TfaRequestDto(
            savedUser, ip, TfaAction.SIGN_IN, lang
        ));

        // 7. Login successful, TFA verification will be handled separately
        return new LoginResponseDto(true); // Indicates TFA verification required
    }

}
