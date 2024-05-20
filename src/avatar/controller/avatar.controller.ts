import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { FindManyAvatarsUC } from "../usecase/find-many-avatars.uc";
import { Roles } from "@app/authorization/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { FindManyAvatarsResponsetDto } from "../dto/find-many-avatars/find-many-avatars.response.dto";

/**
 * Controller for managing avatars.
 * @author Yonatan A Quintero R
 * @date 2024-04-15
 */
@Roles(Role.SYSTEM_ADMIN)
@Controller('avatars')
export class AvatarController {
    constructor(
        private readonly findManyAvatarsUC: FindManyAvatarsUC
    ) { }

    @Get("/")
    @HttpCode(HttpStatus.OK)
    getAvatars(): Promise<FindManyAvatarsResponsetDto> {
        return this.findManyAvatarsUC.execute();
    }
}