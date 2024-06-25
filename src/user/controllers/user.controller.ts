import { Roles } from "@app/authorization/decorators/roles.decorator";
import { Controller, } from "@nestjs/common/decorators";
import { Role } from "@prisma/client";

@Roles(Role.SYSTEM_ADMIN)
@Controller('users')
export class UserController {
    constructor(

    ) { }


}

