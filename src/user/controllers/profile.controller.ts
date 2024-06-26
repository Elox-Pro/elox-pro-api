import { Controller, HttpStatus, HttpCode, Body, Get, Patch } from "@nestjs/common";
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
import { UpdateAvatarRequestDto } from "../dtos/update-avatar/update-avatar.request.dto";
import { UpdateAvatarResponseDto } from "../dtos/update-avatar/update-avatar.response.dto";
import { UpdateAvatarUC } from "../usecases/update-avatar.uc";
import { UpdateNameUC } from "../usecases/update-name.uc";
import { UpdateNameRequestDto } from "../dtos/update-name/update-name.request.dto";
import { UpdateGenderUC } from "../usecases/update-gender.uc";
import { UpdateGenderRequestDto } from "../dtos/update-gender/update-gender.request.dto";
import { UpdateEmailUC } from "../usecases/update-email.uc";
import { UpdateEmailRequestDto } from "../dtos/update-email/update-email-request.dto";
import { UpdateEmailResponseDto } from "../dtos/update-email/update-email-response.dto";
import { UpdatePhoneUC } from "../usecases/update-phone.uc";
import { UpdatePhoneRequestDto } from "../dtos/update-phone/update-phone.request.dto";
import { UpdatePhoneResponseDto } from "../dtos/update-phone/update-phone.response.dto";
import { UpdatePasswordRequestDto } from "../dtos/update-password/update-password-request.dto";
import { UpdatePasswordResponseDto } from "../dtos/update-password/update-password-response.dto";
import { UpdatePasswordUC } from "../usecases/update-password.uc";
import { UpdateTfaUC } from "../usecases/update-tfa.uc";
import { UpdateTfaRequestDto } from "../dtos/update-tfa/update-tfa.request.dto";
import { UpdateTfaResponseDto } from "../dtos/update-tfa/update-tfa.response.dto";

/**
 * Controller for managing user profile.
 * @author Yonatan A Quintero R
 * @date 2024-04-03
 */
@Controller('users/profile')
export class ProfileController {

    constructor(
        private readonly findUserByUsernameUC: FindUserByUsernameUC,
        private readonly updateUserUC: UpdateUserUC,
        private readonly updateAvatarUC: UpdateAvatarUC,
        private readonly updateNameUC: UpdateNameUC,
        private readonly updateGenderUC: UpdateGenderUC,
        private readonly updateEmailUC: UpdateEmailUC,
        private readonly updatePhoneUC: UpdatePhoneUC,
        private readonly updatePasswordUC: UpdatePasswordUC,
        private readonly updateTfaUC: UpdateTfaUC,
    ) { }

    /**
     * Get the profile's authenticated user by username.
     * @param userRequest The user who makes the request.
     * @returns The found user.
     */
    @Get('/')
    @HttpCode(HttpStatus.OK)
    async getProfile(
        @UserRequest() userRequest: ActiveUserDto,
        @Body() dto: FindUserByUsernameRequestDto):
        Promise<FindUserByUserNameResponseDto> {
        dto.setActiveUser(userRequest);
        return this.findUserByUsernameUC.execute(dto);
    }

    /**
     * Update the profile's authenticated user by username.
     * @param UserRequest The user who makes the request.
     * @param dto The update user dto.
     * @returns The updated user.
     */
    @Patch('/')
    @HttpCode(HttpStatus.OK)
    updateProfile(
        @UserRequest() userRequest: ActiveUserDto,
        @Body() dto: UpdateUserRequestDto
    ): Promise<UpdateUserResponseDto> {
        dto.setActiveUser(userRequest);
        return this.updateUserUC.execute(dto);
    }

    @Patch('/avatar')
    @HttpCode(HttpStatus.OK)
    updateProfileAvatar(
        @UserRequest() userRequest: ActiveUserDto,
        @Body() dto: UpdateAvatarRequestDto
    ): Promise<UpdateAvatarResponseDto> {
        dto.setActiveUser(userRequest);
        return this.updateAvatarUC.execute(dto);
    }

    @Patch('/name')
    @HttpCode(HttpStatus.OK)
    updateProfileName(
        @UserRequest() userRequest: ActiveUserDto,
        @Body() dto: UpdateNameRequestDto) {
        dto.setActiveUser(userRequest);
        return this.updateNameUC.execute(dto);
    }

    @Patch('/gender')
    @HttpCode(HttpStatus.OK)
    updateProfileGender(
        @UserRequest() userRequest: ActiveUserDto,
        @Body() dto: UpdateGenderRequestDto) {
        dto.setActiveUser(userRequest);
        return this.updateGenderUC.execute(dto);
    }

    @Patch('/email')
    @HttpCode(HttpStatus.OK)
    updateEmailGender(
        @UserRequest() userRequest: ActiveUserDto,
        @Body() dto: UpdateEmailRequestDto):
        Promise<UpdateEmailResponseDto> {
        dto.setActiveUser(userRequest);
        return this.updateEmailUC.execute(dto);
    }

    @Patch('/phone')
    @HttpCode(HttpStatus.OK)
    updateProfilePhone(
        @UserRequest() userRequest: ActiveUserDto,
        @Body() dto: UpdatePhoneRequestDto):
        Promise<UpdatePhoneResponseDto> {
        dto.setActiveUser(userRequest);
        return this.updatePhoneUC.execute(dto);
    }

    @Patch('/password')
    @HttpCode(HttpStatus.OK)
    updateProfilePassword(
        @UserRequest() userRequest: ActiveUserDto,
        @Body() dto: UpdatePasswordRequestDto):
        Promise<UpdatePasswordResponseDto> {
        dto.setActiveUser(userRequest);
        return this.updatePasswordUC.execute(dto);
    }

    @Patch('/tfa')
    @HttpCode(HttpStatus.OK)
    updateProfileTfa(
        @UserRequest() userRequest: ActiveUserDto,
        @Body() dto: UpdateTfaRequestDto): Promise<UpdateTfaResponseDto> {
        dto.setActiveUser(userRequest);
        return this.updateTfaUC.execute(dto);
    }

}