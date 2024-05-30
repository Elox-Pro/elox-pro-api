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

@Module({
    imports: [
        TfaModule,
    ],
    controllers: [ProfileController],
    providers: [
        FindUserByUsernameUC,
        UpdateUserUC,
        UpdateAvatarUC,
        UpdateNameUC,
        UpdateGenderUC,
        UpdateEmailUC,
        UpdatePhoneUC,
        UpdatePasswordUC,
        UpdateTfaUC
    ]
})
export class UserModule { }