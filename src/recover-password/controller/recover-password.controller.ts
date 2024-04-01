import { Authentication } from "@app/authentication/decorators/authentication.decorator";
import { AuthenticationType } from "@app/authentication/enums/authentication-type.enum";
import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseInterceptors } from "@nestjs/common";
import { RecoverPasswordInitUC } from "../usecases/recover-password-init.uc";
import { IpClientInterceptor } from "@app/common/interceptors/ip-client.interceptor";
import { LangClientInterceptor } from "@app/common/interceptors/lang-client.interceptor";
import { Recaptcha } from "@nestlab/google-recaptcha";
import { RecoverPasswordInitRequestDto } from "../dtos/recover-password-init/recover-password-init.request.dto";
import { RecoverPasswordInitResponseDto } from "../dtos/recover-password-init/recover-password-init.response.dto";
import { Request, Response } from "express";
import { RecoverPasswordResetRequestDto } from "../dtos/recover-password-reset/recover-password-reset.request.dto";
import { RecoverPasswordResetResponseDto } from "../dtos/recover-password-reset/recover-password-reset.response.dto";
import { RecoverPasswordResetUC } from "../usecases/recover-passwrod-reset.uc";

@Controller('recover-password')
@Authentication(AuthenticationType.None)
export class RecoverPasswordController {

    constructor(
        private readonly recoverPasswordInitUC: RecoverPasswordInitUC,
        private readonly recoverPasswordResetUC: RecoverPasswordResetUC
    ) { }

    @Post('init')
    @UseInterceptors(IpClientInterceptor, LangClientInterceptor)
    @Recaptcha()
    @HttpCode(HttpStatus.OK)
    async init(
        @Body() dto: RecoverPasswordInitRequestDto): Promise<RecoverPasswordInitResponseDto> {
        return await this.recoverPasswordInitUC.execute(dto);
    }

    @Post('reset')
    @UseInterceptors(LangClientInterceptor)
    @Recaptcha()
    @HttpCode(HttpStatus.OK)
    async reset(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
        @Body() dto: RecoverPasswordResetRequestDto): Promise<RecoverPasswordResetResponseDto> {
        dto.setResponse(response);
        dto.setRequest(request);
        return await this.recoverPasswordResetUC.execute(dto);
    }

}