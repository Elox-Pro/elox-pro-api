import { Controller, HttpStatus, HttpCode, Body, Get, Patch, UseInterceptors } from "@nestjs/common";
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
import { LangClientInterceptor } from "@app/common/interceptors/lang-client.interceptor";
import { UpdateAvatarRequestDto } from "../dtos/update-avatar/update-avatar.request.dto";
import { UpdateAvatarResponseDto } from "../dtos/update-avatar/update-avatar.response.dto";
import { UpdateAvatarUC } from "../usecases/update-avatar.uc";

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
        private readonly updateUserUC: UpdateUserUC,
        private readonly updateAvatarUC: UpdateAvatarUC
    ) { }

    /**
     * Get the profile's authenticated user by username.
     * @param userRequest The user who makes the request.
     * @returns The found user.
     */
    @Get('/profile/')
    @HttpCode(HttpStatus.OK)
    getProfile(
        @UserRequest() userRequest: ActiveUserDto,
        @Body() dto: FindUserByUsernameRequestDto): Promise<FindUserByUserNameResponseDto> {
        dto.setUserRequest(userRequest);
        return this.findUserByUsernameUC.execute(dto);
    }

    /**
     * Update the profile's authenticated user by username.
     * @param UserRequest The user who makes the request.
     * @param dto The update user dto.
     * @returns The updated user.
     */
    @Patch('/profile/')
    @HttpCode(HttpStatus.OK)
    updateProfile(
        @UserRequest() userRequest: ActiveUserDto,
        @Body() dto: UpdateUserRequestDto
    ): Promise<UpdateUserResponseDto> {
        dto.setUsername(userRequest.username);
        return this.updateUserUC.execute(dto);
    }

    @Patch('/profile/avatar')
    @HttpCode(HttpStatus.OK)
    updateProfileAvatar(
        @UserRequest() userRequest: ActiveUserDto,
        @Body() dto: UpdateAvatarRequestDto
    ): Promise<UpdateAvatarResponseDto> {
        dto.setUserRequest(userRequest);
        return this.updateAvatarUC.execute(dto);
    }

}