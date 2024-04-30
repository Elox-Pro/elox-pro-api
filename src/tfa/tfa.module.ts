import { TfaFactory } from './factories/tfa.factory';
import { TfaStrategyProcessor } from './processors/tfa.strategy.processor';
import { EmailTfaStrategy } from './strategies/tfa/email-tfa.strategy';
import { Module } from '@nestjs/common';
import { ValidateTfaUC } from './usecases/validate-tfa.uc';
import { TfaController } from './controllers/tfa.controller';
import { JwtAppModule } from '@app/jwt-app/jwt-app.module';
import { TfaActionFactory } from './factories/tfa-action.factory';
import { LoginTfaActionStrategy } from './strategies/tfa-action/login-tfa-action.strategy';
import { SignUpTfaActionStrategy } from './strategies/tfa-action/signup-tfa-action.strategy';
import { RecoverPasswordTfaActionStrategy } from './strategies/tfa-action/recover-password-tfa-action.strategy';
import { UpdateEmailTfaActionStrategy } from './strategies/tfa-action/update-email-tfa-action.strategy';
import { UpdatePasswordTfaActionStrategy } from './strategies/tfa-action/update-password-action.strategy';

@Module({
    imports: [
        JwtAppModule,
    ],
    providers: [
        EmailTfaStrategy,
        LoginTfaActionStrategy,
        RecoverPasswordTfaActionStrategy,
        TfaActionFactory,
        TfaFactory,
        TfaStrategyProcessor,
        SignUpTfaActionStrategy,
        ValidateTfaUC,
        UpdateEmailTfaActionStrategy,
        UpdatePasswordTfaActionStrategy
    ],
    controllers: [
        TfaController
    ],
})
export class TfaModule { }
