import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { LoginRequestDto } from "authentication/dtos/login/login.request.dto";
import { IUseCase } from "common/usecase/usecase.interface";
import { JwtAccessPayloadDto } from "../dtos/jwt/jwt-access-payload.dto";
import { LoginResponseDto } from "../dtos/login/login.response.dto";
import { PrismaService } from "prisma//prisma.service";
import { HashingStrategy } from "../strategies/hashing/hashing.strategy";
import { TFARequestDto } from "../dtos/tfa/tfa.request.dto";
import { TFA_STRATEGY_QUEUE } from "../constants/authentication.constants";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";
import { TfaType } from "@prisma/client";
import { JwtStrategy } from "../strategies/jwt/jwt.strategy";
import JWTCookieService from "../services/jwt-cookie.service";
import { ActiveUserDto } from "@app/authorization/dto/active-user.dto";
import getUserLang from "@app/common/helpers/get-user-lang.helper";
import { TfaAction } from "../enums/tfa-action.enum";

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
     * @param data The login request data.
     * @returns A promise resolving to a LoginResponseDto.
     * @throws BadRequestException if login credentials are invalid.
     */
    async execute(data: LoginRequestDto): Promise<LoginResponseDto> {

        // 1. Find the user by username
        const savedUser = await this.prisma.user.findUnique({
            where: { username: data.username },
        });

        // 2. Check if user exists
        if (!savedUser) {
            this.logger.error(`username not found: ${data.username}`);
            throw new BadRequestException('error.invalid-credentials');
        }

        // 3. Validate password
        if (!await this.hashingStrategy.compare(data.password, savedUser.password)) {
            this.logger.error('Invalid password');
            throw new BadRequestException('error.invalid-credentials');
        }

        // 4. Check if Two-Factor Authentication (TFA) is required for this user
        if (savedUser.tfaType === TfaType.NONE) {
            // 4.1 No TFA required, generate access tokens and set session cookie
            const payload = new JwtAccessPayloadDto(savedUser.username, savedUser.role);
            const tokens = await this.jwtStrategy.generate(payload);
            const activeUser = new ActiveUserDto(payload.sub, payload.role, true);
            this.jwtCookieService.createSession(data.getResponse(), tokens, activeUser);
            return new LoginResponseDto(false); // Indicates no further action needed
        }

        // 5. Update user language (optional, based on logic in getUserLang)
        savedUser.lang = getUserLang(savedUser.lang, data.lang);

        // 6. User requires TFA but hasn't verified email (applicable for EMAIL or SMS TFA)
        if (!savedUser.emailVerified &&
            [TfaType.EMAIL, TfaType.SMS].findIndex(tfaType => tfaType === savedUser.tfaType) > -1) {

            this.logger.warn(`Account not verified: ${savedUser.username}`);

            await this.tfaStrategyQueue.add(new TFARequestDto(
                savedUser, data.ipClient, TfaAction.SIGN_UP // Treat login like a sign-up for verification
            ));

            return new LoginResponseDto(true); // Indicates verification required
        }

        // 7. Queue a TFA request for sign-in verification (assuming TFA is enabled)
        await this.tfaStrategyQueue.add(new TFARequestDto(
            savedUser, data.ipClient, TfaAction.SIGN_IN
        ));

        // 8. Login successful, TFA verification will be handled separately
        return new LoginResponseDto(true); // Indicates TFA verification required
    }

}
