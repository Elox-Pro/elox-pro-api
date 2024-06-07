import { Roles } from "@app/authorization/decorators/roles.decorator";
import { Controller, Get, HttpCode, Query } from "@nestjs/common/decorators";
import { Role } from "@prisma/client";
import { FindManyUsersUC } from "../usecases/find-many-users.uc";
import { HttpStatus } from "@nestjs/common";
import { UserRequest } from "@app/authorization/decorators/user.request.decorator";
import { ActiveUserDto } from "@app/authorization/dto/active-user.dto";
import { FindManyUsersResponseDto } from "../dtos/find-many-users/find-many-users.response.dto";
import { FindManyUsersRequestDto } from "../dtos/find-many-users/find-many-users.request.dto";

@Roles(Role.SYSTEM_ADMIN)
@Controller('users')
export class UserController {
    constructor(
        private readonly findManyUsersUC: FindManyUsersUC,
    ) { }

    @Get("/")
    @HttpCode(HttpStatus.OK)
    findManyUsers(
        @UserRequest() activeUser: ActiveUserDto,
        @Query() request: FindManyUsersRequestDto
    ): Promise<FindManyUsersResponseDto> {
        request.setActiveUser(activeUser);
        return this.findManyUsersUC.execute(request);
    }

}

