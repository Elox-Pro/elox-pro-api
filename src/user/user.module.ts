import { Module } from "@nestjs/common";
import { FindUserByUsernameUC } from "./usecases/find-user-by-username.uc";
import { UserController } from "./controllers/user.controller";
import { UpdateUserUC } from "./usecases/update-user.uc";
import { UserTranslator } from "./translators/user.translator";
import { UpdateAvatarUC } from "./usecases/update-avatar.uc";
import { UpdateNameUC } from "./usecases/update-name.uc";

@Module({
    controllers: [UserController],
    providers: [
        FindUserByUsernameUC,
        UpdateUserUC,
        UserTranslator,
        UpdateAvatarUC,
        UpdateNameUC
    ]
})
export class UserModule { }