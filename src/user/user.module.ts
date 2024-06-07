import { Module } from "@nestjs/common";
import { FindUserByUsernameUC } from "./usecases/find-user-by-username.uc";
import { UpdateUserUC } from "./usecases/update-user.uc";
import { UpdateAvatarUC } from "./usecases/update-avatar.uc";
import { UpdateNameUC } from "./usecases/update-name.uc";
import { UpdateGenderUC } from "./usecases/update-gender.uc";
import { UpdateEmailUC } from "./usecases/update-email.uc";
import { UpdatePhoneUC } from "./usecases/update-phone.uc";
import { UpdatePasswordUC } from "./usecases/update-password.uc";
import { UpdateTfaUC } from "./usecases/update-tfa.uc";
import { ProfileController } from "./controllers/profile.controller";
import { TfaModule } from "@app/tfa/tfa.module";
import { FindManyUsersUC } from "./usecases/find-many-users.uc";
import { UserController } from "./controllers/user.controller";

@Module({
    imports: [
        TfaModule,
    ],
    controllers: [ProfileController, UserController],
    providers: [
        FindUserByUsernameUC,
        UpdateUserUC,
        UpdateAvatarUC,
        UpdateNameUC,
        UpdateGenderUC,
        UpdateEmailUC,
        UpdatePhoneUC,
        UpdatePasswordUC,
        UpdateTfaUC,
        FindManyUsersUC,
    ]
})
export class UserModule { }