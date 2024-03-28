import { TfaFactory } from './factories/tfa.factory';
import { TfaStrategyProcessor } from './processors/tfa.strategy.processor';
import { EmailTfaStrategy } from './strategies/email-tfa.strategy';
import { Module } from '@nestjs/common';
import { ValidateTfaUC } from './usecases/validate-tfa.uc';
import { TfaController } from './controllers/tfa.controller';
import { JwtAppModule } from '@app/jwt-app/jwt-app.module';

@Module({
    imports: [
        JwtAppModule,
    ],
    providers: [
        EmailTfaStrategy,
        TfaFactory,
        TfaStrategyProcessor,
        ValidateTfaUC,
    ],
    controllers: [
        TfaController
    ],
})
export class TfaModule { }
