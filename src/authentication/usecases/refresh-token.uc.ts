import { Injectable, Logger } from "@nestjs/common";
import { RefreshTokenRequestDto } from "../dtos/refresh-token.request.dto";
import { RefreshTokenResponseDto } from "../dtos/refresh-token.response.dto";
import { IUseCase } from "@app/common/usecase/usecase.interface";
import { JwtStrategy } from "../strategies/jwt/jwt.strategy";

@Injectable()
export class RefreshTokenUC implements IUseCase<RefreshTokenRequestDto, RefreshTokenResponseDto> {

    private readonly logger = new Logger(RefreshTokenUC.name);

    constructor(
        private readonly jwtStrategy: JwtStrategy,
    ) { }

    async execute(data: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
        try {

            const payload = await this.jwtStrategy.verify(data.refreshToken);

            this.logger.debug(`payload: ${JSON.stringify(payload)}`);

            return new RefreshTokenResponseDto();

        } catch (error) {

        }

    }
}