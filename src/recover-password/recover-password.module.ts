import { Module } from "@nestjs/common";
import { RecoverPasswordController } from "./controller/recover-password.controller";
import { RecoverPasswordInitUC } from "./usecases/recover-password-init.uc";
import { RecoverPasswordResetUC } from "./usecases/recover-passwrod-reset.uc";
import { TfaModule } from "@app/tfa/tfa.module";

@Module({
    imports:[
        TfaModule,
    ],
    controllers: [
        RecoverPasswordController
    ],
    providers: [
        RecoverPasswordInitUC,
        RecoverPasswordResetUC,
    ]
})
export class RecoverPasswordModule { }