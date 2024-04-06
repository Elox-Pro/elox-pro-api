import { Controller, HttpStatus, HttpCode, Body, Get, Param, Patch } from "@nestjs/common";
import { FindUserByUsernameUC } from "../usecases/find-user-by-username.uc";
import { FindUserByUsernameRequestDto } from "../dtos/find-user-by-username/find-user-by-username.request.dto";
import { FindUserByUserNameResponseDto } from "../dtos/find-user-by-username/find-user-by-username.response.dto";
import { Roles } from "@app/authorization/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { UserRequest } from "@app/authorization/decorators/user.request.decorator";
import { ActiveUserDto } from "@app/authorization/dto/active-user.dto";
import { UpdateUserUC } from "../usecases/update-user.uc";
import { UpdateUserRequestDto } from "../dtos/update-user/update-user.request.dto";
import { UpdateUserResponseDto } from "../dtos/update-user/update-user.response.dto";

/**
 * Controller for managing users.
 * @author Yonatan A Quintero R
 * @date 2024-04-03
 */
@Controller('users')
@Roles(Role.SYSTEM_ADMIN)
export class UserController {

    constructor(
        private readonly findUserByUsernameUC: FindUserByUsernameUC,
        private readonly updateUserUC: UpdateUserUC
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
        return this.findUserByUsernameUC.execute(new FindUserByUsernameRequestDto(userRequest.sub));
    }

    /**
     * Update the current authenticated user by username.
     * @param UserRequest The user who makes the request.
     * @param dto The update user dto.
     * @returns The updated user.
     */
    @Patch('/current/')
    @HttpCode(HttpStatus.OK)
    updateCurrentUser(
        @UserRequest() UserRequest: ActiveUserDto,
        @Body() dto: UpdateUserRequestDto
    ): Promise<UpdateUserResponseDto> {
        dto.setUsername(UserRequest.sub);
        return this.updateUserUC.execute(dto);
    }

}