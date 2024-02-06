import { IUseCase } from "@app/common/usecase/usecase.interface";
import { ValidateTfaDto } from "../dtos/validate-tfa.dto";
import { ValidateTfaResponseDto } from "../dtos/validate-tfa-response.dto";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { TfaStrategy } from "../strategies/tfa/tfa.strategy";
import { PrismaService } from "@app/prisma/prisma.service";
import { JwtStrategy } from "../strategies/jwt/jwt.strategy";
import { TfaFactory } from "../factories/tfa.factory";
import { JwtInputDto } from "../dtos/jwt-input.dto";

@Injectable()
export class ValidateTfaUC implements IUseCase<ValidateTfaDto, ValidateTfaResponseDto>{

    private readonly logger = new Logger(ValidateTfaUC.name);

    constructor(
        private readonly tfaFactory: TfaFactory,
        private readonly prisma: PrismaService,
        private readonly jwtStrategy: JwtStrategy
    ) { }

    async execute(data: ValidateTfaDto): Promise<ValidateTfaResponseDto> {

        const savedUser = await this.prisma.user.findUnique({
            where: { username: data.username }
        });

        if (!savedUser) {
            this.logger.error(`username not found: ${data.username}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        const strategy = this.tfaFactory.getTfaStrategy(savedUser.tfaType);

        if (!strategy) {
            this.logger.error('TfaStrategy is required');
            throw new UnauthorizedException('Invalid credentials');
        }

        const result = await strategy.verify(
            savedUser.username,
            data.code.toString()
        );

        if (!result) {
            this.logger.error('Invalid code');
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.jwtStrategy.generate(
            new JwtInputDto(savedUser.id, savedUser.role, savedUser.username)
        );

        return new ValidateTfaResponseDto(tokens.accessToken, tokens.refreshToken);

    }

}