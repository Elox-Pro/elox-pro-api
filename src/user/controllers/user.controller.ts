import { Controller, HttpStatus, HttpCode, Body, Get } from "@nestjs/common";
import { GetProfileUC } from "../usecases/get-profile.uc";
import { GetProfileRequestDto } from "../dtos/get-profile.request.dto";
import { GetProfileResponseDto } from "../dtos/get-profile.response.dto";
import { Roles } from "@app/authorization/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { Authentication } from "@app/authentication/decorators/authentication.decorator";
import { AuthenticationType } from "@app/authentication/enums/authentication-type.enum";

@Controller('user')
@Roles(Role.SYSTEM_ADMIN)
export class UserController {

    constructor(
        private getProfileUC: GetProfileUC,
    ) { }

    @Get('/profile')
    @HttpCode(HttpStatus.OK)
    getProfile(@Body() dto: GetProfileRequestDto): Promise<GetProfileResponseDto> {
        return this.getProfileUC.execute(dto);
    }

}