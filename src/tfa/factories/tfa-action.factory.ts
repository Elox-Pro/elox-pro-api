import { Injectable } from "@nestjs/common";
import { SignUpTfaActionStrategy } from "../strategies/tfa-action/signup-tfa-action.strategy";
import { LoginTfaActionStrategy } from "../strategies/tfa-action/login-tfa-action.strategy";
import { RecoverPasswordTfaActionStrategy } from "../strategies/tfa-action/recover-password-tfa-action.strategy";
import { TfaAction } from "../enums/tfa-action.enum";
import { TfaActionStrategy } from "../strategies/tfa-action/tfa-action.strategy";
import { UpdateEmailTfaActionStrategy } from "../strategies/tfa-action/update-email-tfa-action.strategy";

@Injectable()
export class TfaActionFactory {
    constructor(
        private readonly signUpStrategy: SignUpTfaActionStrategy,
        private readonly loginStrategy: LoginTfaActionStrategy,
        private readonly recoverPasswordStrategy: RecoverPasswordTfaActionStrategy,
        private readonly updateEmailStrategy: UpdateEmailTfaActionStrategy,
    ) { }

    createStrategy(action: TfaAction): TfaActionStrategy {
        switch (action) {
            case TfaAction.SIGN_UP:
                return this.signUpStrategy;
            case TfaAction.SIGN_IN:
                return this.loginStrategy;
            case TfaAction.RECOVER_PASSWORD:
                return this.recoverPasswordStrategy;
            case TfaAction.UPDATE_EMAIL:
                return this.updateEmailStrategy;
            default:
                throw new Error('Invalid action');
        }
    }
}