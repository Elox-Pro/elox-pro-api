import { Controller, HttpStatus, HttpCode, Body, Get, Param } from "@nestjs/common";
import { GetProfileUC } from "../usecases/get-profile.uc";
import { GetProfileRequestDto } from "../dtos/get-profile.request.dto";
import { GetProfileResponseDto } from "../dtos/get-profile.response.dto";
import { Roles } from "@app/authorization/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { UserRequest } from "@app/authorization/decorators/user.request.decorator";
import { UserRequestDto } from "@app/authorization/dto/user.request.dto";

@Controller('users')
@Roles(Role.SYSTEM_ADMIN)
export class UserController {

    constructor(
        private getProfileUC: GetProfileUC,
    ) { }

    @Get('/:username/profile')
    @HttpCode(HttpStatus.OK)
    getProfile(
        // @Body() dto: GetProfileRequestDto,
        @Param('username') username: string,
        @UserRequest() userRequest: UserRequestDto
    ): Promise<GetProfileResponseDto> {

        console.log(username, userRequest);
        return this.getProfileUC.execute(new GetProfileRequestDto(username));

    }

}