import { Module } from "@nestjs/common";
import { GetProfileUC } from "./usecases/get-profile.uc";
import { UserController } from "./controllers/user.controller";

@Module({
    controllers: [UserController],
    providers: [GetProfileUC]
})
export class UserModule { }