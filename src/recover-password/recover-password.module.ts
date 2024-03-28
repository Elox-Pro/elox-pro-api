import { Module } from "@nestjs/common";
import { RecoverPasswordController } from "./controller/recover-password.controller";
import { RecoverPasswordInitUC } from "./usecases/recover-password-init.uc";

@Module({
    controllers: [
        RecoverPasswordController
    ],
    providers: [
        RecoverPasswordInitUC
    ]
})
export class RecoverPasswordModule { }