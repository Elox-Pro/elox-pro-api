import { JwtAccessPayloadDto } from "@app/authentication/dtos/jwt/jwt-access-payload.dto";
import { JwtRefreshPayloadDto } from "@app/authentication/dtos/jwt/jwt-refresh-payload.dto";
import { JwtTokensDto } from "@app/authentication/dtos/jwt/jwt-tokens.dto";
import { Injectable } from "@nestjs/common";


@Injectable()
export abstract class JwtStrategy {
    abstract generate(
        accessPayloadDto: JwtAccessPayloadDto, refreshPayloadDto?: JwtRefreshPayloadDto
    ): Promise<JwtTokensDto>;

    abstract verify<T extends JwtAccessPayloadDto | JwtRefreshPayloadDto>(token: string): Promise<T>;

    abstract validateRefreshToken(payload: JwtRefreshPayloadDto): Promise<Boolean>;
}