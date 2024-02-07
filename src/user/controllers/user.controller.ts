import { Controller, HttpStatus, HttpCode, Body, Get } from "@nestjs/common";
import { GetProfileUC } from "../usecases/get-profile.uc";
import { GetProfileRequestDto } from "../dtos/get-profile.request.dto";
import { GetProfileResponseDto } from "../dtos/get-profile.response.dto";
import { Roles } from "@app/authorization/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { UserRequest } from "@app/authorization/decorators/user.request.decorator";
import { UserRequestDto } from "@app/authorization/dto/user.request.dto";

@Controller('user')
@Roles(Role.SYSTEM_ADMIN)
export class UserController {

    constructor(
        private getProfileUC: GetProfileUC,
    ) { }

    @Get('/profile')
    @HttpCode(HttpStatus.OK)
    getProfile(@Body() dto: GetProfileRequestDto,
        @UserRequest() userRequest: UserRequestDto): Promise<GetProfileResponseDto> {
        console.log(userRequest);
        return this.getProfileUC.execute(dto);
    }

}