import { Authentication } from "@app/authentication/decorators/authentication.decorator";
import { AuthenticationType } from "@app/authentication/enums/authentication-type.enum";
import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { RecoverPasswordInitUC } from "../usecases/recover-password-init.uc";
import { Recaptcha } from "@nestlab/google-recaptcha";
import { RecoverPasswordInitRequestDto } from "../dtos/recover-password-init/recover-password-init.request.dto";
import { RecoverPasswordInitResponseDto } from "../dtos/recover-password-init/recover-password-init.response.dto";
import { Request, Response } from "express";
import { RecoverPasswordResetRequestDto } from "../dtos/recover-password-reset/recover-password-reset.request.dto";
import { RecoverPasswordResetResponseDto } from "../dtos/recover-password-reset/recover-password-reset.response.dto";
import { RecoverPasswordResetUC } from "../usecases/recover-passwrod-reset.uc";
import { GuestRequest } from "@app/authorization/decorators/guest.request.decorator";
import { GuestUserDto } from "@app/authorization/dto/guest-user.dto";

@Controller('recover-password')
@Authentication(AuthenticationType.None)
export class RecoverPasswordController {

    constructor(
        private readonly recoverPasswordInitUC: RecoverPasswordInitUC,
        private readonly recoverPasswordResetUC: RecoverPasswordResetUC
    ) { }

    @Post('init')
    @Recaptcha()
    @HttpCode(HttpStatus.OK)
    async init(
        @GuestRequest() guestUserDto: GuestUserDto,
        @Body() dto: RecoverPasswordInitRequestDto
    ): Promise<RecoverPasswordInitResponseDto> {
        dto.setGuestUser(guestUserDto);
        return await this.recoverPasswordInitUC.execute(dto);
    }

    @Post('reset')
    @Recaptcha()
    @HttpCode(HttpStatus.OK)
    async reset(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
        @GuestRequest() guestUserDto: GuestUserDto,
        @Body() dto: RecoverPasswordResetRequestDto
    ): Promise<RecoverPasswordResetResponseDto> {
        guestUserDto.setResponse(response);
        guestUserDto.setRequest(request);
        dto.setGuestUser(guestUserDto);
        return await this.recoverPasswordResetUC.execute(dto);
    }

}