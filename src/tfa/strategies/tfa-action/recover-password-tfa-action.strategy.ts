import { Injectable } from "@nestjs/common";
import { TfaActionStrategy } from "./tfa-action.strategy";
import { ValidateTFARequestDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.request.dto";
import { ValidateTFAResponseDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.response.dto";
import { User } from "@prisma/client";
import { TfaAction } from "@app/tfa/enums/tfa-action.enum";
import { SessionCookieService } from "@app/common/services/session-cookie.service";
import { HashingStrategy } from "@app/common/strategies/hashing/hashing.strategy";

/**
 * TFA action strategy for recovering a password.
 * Generates and sets a token in a session cookie for password recovery validation.
 * @author Yonatan A Quintero R
 * @date 2024-04-01
 */
@Injectable()
export class RecoverPasswordTfaActionStrategy extends TfaActionStrategy {

    private readonly TTL_IN_SECONDS = 60 * 5; // 5 minutes

    constructor(
        private readonly sessionCookieService: SessionCookieService,
        private readonly hashingStrategy: HashingStrategy,
    ) {
        super();
    }

    /**
     * Executes the TFA action strategy for recovering a password.
     * Generates and sets a token in a session cookie for password recovery validation.
     * @param data The validate TFA request data.
     * @param user The user requesting password recovery.
     * @returns A promise resolving to a ValidateTFAResponseDto with the TFA action for password recovery.
     */
    async execute(data: ValidateTFARequestDto, user: User): Promise<ValidateTFAResponseDto> {

        const { username } = data;

        const token = await this.hashingStrategy.hash(username);
        this.sessionCookieService.create(data.getResponse(), token, this.TTL_IN_SECONDS);

        return new ValidateTFAResponseDto(user.tfaType, TfaAction.RECOVER_PASSWORD);
    }
}
