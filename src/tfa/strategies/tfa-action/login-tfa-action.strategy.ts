import { Injectable } from "@nestjs/common";
import { TfaActionStrategy } from "./tfa-action.strategy";
import { ValidateTFARequestDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.request.dto";
import { ValidateTFAResponseDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.response.dto";
import { User } from "@prisma/client";
import { JwtAccessPayloadDto } from "@app/jwt-app/dtos/jwt/jwt-access-payload.dto";
import { ActiveUserDto } from "@app/authorization/dto/active-user.dto";
import { JwtStrategy } from "@app/jwt-app/strategies/jwt.strategy";
import { JwtCookieService } from "@app/jwt-app/services/jwt-cookie.service";
import { TfaAction } from "@app/tfa/enums/tfa-action.enum";

@Injectable()
export class LoginTfaActionStrategy extends TfaActionStrategy {

    constructor(
        private readonly jwtStrategy: JwtStrategy,
        private readonly jwtCookieService: JwtCookieService
    ) {
        super();
    }
    async execute(data: ValidateTFARequestDto, user: User): Promise<ValidateTFAResponseDto> {
        const payload = new JwtAccessPayloadDto(user.username, user.role);
        const activeUser = new ActiveUserDto(payload.sub, payload.role, true);
        const tokens = await this.jwtStrategy.generate(payload);
        this.jwtCookieService.createSession(data.getResponse(), tokens, activeUser);
        return new ValidateTFAResponseDto(user.tfaType, TfaAction.SIGN_IN);
    }
}