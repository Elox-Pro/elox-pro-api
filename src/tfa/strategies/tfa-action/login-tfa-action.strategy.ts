import { Injectable } from "@nestjs/common";
import { TfaActionStrategy } from "./tfa-action.strategy";
import { ValidateTFARequestDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.request.dto";
import { ValidateTFAResponseDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.response.dto";
import { User } from "@prisma/client";
import { TfaAction } from "@app/tfa/enums/tfa-action.enum";
import { JwtCookieSessionService } from "@app/jwt-app/services/jwt-cookie-session.service";

/**
 * A strategy class for handling TFA action related to login.
 * This class extends TfaActionStrategy and implements the execute method to create a session for the user.
 * @author Yonatan A Quintero R
 * @date 2024-04-03
 */
@Injectable()
export class LoginTfaActionStrategy extends TfaActionStrategy {

    /**
     * Creates an instance of LoginTfaActionStrategy.
     * @param jwtCookieSessionService The JwtCookieSessionService instance for creating sessions.
     */
    constructor(
        private readonly jwtCookieSessionService: JwtCookieSessionService,
    ) {
        super();
    }

    /**
     * Executes the TFA action strategy for login.
     * Creates a session for the user using the CookieSessionService.
     * @param data The ValidateTFARequestDto containing request data.
     * @param user The User object.
     * @returns A Promise resolving to a ValidateTFAResponseDto with the TFA action set to SIGN_IN.
     */
    async execute(data: ValidateTFARequestDto, user: User): Promise<ValidateTFAResponseDto> {
        // Create a session for the user using the CookieSessionService
        await this.jwtCookieSessionService.create(
            data.getResponse(),
            user,
            data.ipClient
        );
        // Return a response with the TFA action set to SIGN_IN
        return new ValidateTFAResponseDto(user.tfaType, TfaAction.SIGN_IN);
    }
}
