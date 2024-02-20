import { IUseCase } from "@app/common/usecase/usecase.interface";
import { ValidateTFARequestDto } from "../dtos/validate-tfa.request.dto";
import { ValidateTFAResponseDto } from "../dtos/validate-tfa.response.dto";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";
import { JwtStrategy } from "../strategies/jwt/jwt.strategy";
import { TFAFactory } from "../factories/tfa.factory";
import { JwtAccessPayloadDto } from "../dtos/jwt-access-payload.dto";

@Injectable()
export class ValidateTfaUC implements IUseCase<ValidateTFARequestDto, ValidateTFAResponseDto>{

    private readonly logger = new Logger(ValidateTfaUC.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly tfaFactory: TFAFactory,
        private readonly jwtStrategy: JwtStrategy
    ) { }

    async execute(data: ValidateTFARequestDto): Promise<ValidateTFAResponseDto> {

        const savedUser = await this.prisma.user.findUnique({
            where: { username: data.username }
        });

        if (!savedUser) {
            this.logger.error(`Username not found: ${data.username}`);
            throw new UnauthorizedException('Invalid credentials');
        }

        const strategy = this.tfaFactory.getTfaStrategy(savedUser.tfaType);

        if (!strategy) {
            this.logger.error('Tfa strategy is required');
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
            new JwtAccessPayloadDto(savedUser.username, savedUser.role)
        );

        return new ValidateTFAResponseDto(tokens);
    }

}