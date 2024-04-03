import { Controller, HttpStatus, HttpCode, Body, Get, Param, UnauthorizedException, Logger } from "@nestjs/common";
import { FindUserByUsername } from "../usecases/find-user-by-username";
import { FindUserByUsernameRequestDto } from "../dtos/find-user-by-username/find-user-by-username.request.dto";
import { FindUserByUserNameResponseDto } from "../dtos/find-user-by-username/find-user-by-username.response.dto";
import { Roles } from "@app/authorization/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { UserRequest } from "@app/authorization/decorators/user.request.decorator";
import { ActiveUserDto } from "@app/authorization/dto/active-user.dto";

/**
 * Controller for managing users.
 * @author Yonatan A Quintero R
 * @date 2024-04-03
 */
@Controller('users')
@Roles(Role.SYSTEM_ADMIN)
export class UserController {

    private readonly logger = new Logger(UserController.name);
    constructor(
        private findUserByUsername: FindUserByUsername,
    ) { }

    /**
     * Get the current authenticated user by username.
     * @param userRequest The user who makes the request.
     * @returns The found user.
     */
    @Get('/current/')
    @HttpCode(HttpStatus.OK)
    getCurrent(@UserRequest() userRequest: ActiveUserDto
    ): Promise<FindUserByUserNameResponseDto> {
        return this.findUserByUsername.execute(new FindUserByUsernameRequestDto(userRequest.sub));
    }

}