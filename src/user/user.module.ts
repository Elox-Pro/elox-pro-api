import { Module } from "@nestjs/common";
import { FindUserByUsername } from "./usecases/find-user-by-username";
import { UserController } from "./controllers/user.controller";

@Module({
    controllers: [UserController],
    providers: [FindUserByUsername]
})
export class UserModule { }