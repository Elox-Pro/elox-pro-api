import { Module } from "@nestjs/common";
import { FindUserByUsernameUC } from "./usecases/find-user-by-username.uc";
import { UserController } from "./controllers/user.controller";
import { UpdateUserUC } from "./usecases/update-user.uc";
import { UserTranslator } from "./translate/user.translate";

@Module({
    controllers: [UserController],
    providers: [FindUserByUsernameUC, UpdateUserUC, UserTranslator]
})
export class UserModule { }