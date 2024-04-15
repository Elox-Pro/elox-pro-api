import { Module } from "@nestjs/common";
import { FindManyAvatarsUC } from "./usecase/find-many-avatars.uc";
import { AvatarController } from "./controller/avatar.controller";

@Module({
    controllers: [AvatarController],
    providers: [FindManyAvatarsUC]
})
export class AvatarModule { }