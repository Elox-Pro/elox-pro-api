import { Module } from '@nestjs/common';
import { AuthenticationController } from './controllers/authentication.controller';
import { LoginUC } from './usecases/login.uc';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication.guard';
import { LogoutUC } from './usecases/logout.uc';
import { SignupUC } from './usecases/signup.uc';
import { JwtAppModule } from '@app/jwt-app/jwt-app.module';

@Module({
    imports: [
        JwtAppModule
    ],
    controllers: [
        AuthenticationController
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthenticationGuard,
        },
        LoginUC,
        LogoutUC,
        SignupUC,
    ],
})
export class AuthenticationModule { }