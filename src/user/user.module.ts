import { Module } from "@nestjs/common";
import { FindUserByUsernameUC } from "./usecases/find-user-by-username.uc";
import { UserController } from "./controllers/user.controller";
import { UpdateUserUC } from "./usecases/update-user.uc";

@Module({
    controllers: [UserController],
    providers: [FindUserByUsernameUC, UpdateUserUC]
})
export class UserModule { }