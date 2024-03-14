import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseInterceptors } from "@nestjs/common";
import { LoginUC } from "../usecases/login.uc";
import { LoginRequestDto } from "../dtos/login.request.dto";
import { IpClientInterceptor } from "../interceptors/ip-client.interceptor";
import { LoginResponseDto } from "../dtos/login.response.dto";
import { ValidateTfaUC } from "../usecases/validate-tfa.uc";
import { ValidateTFARequestDto } from "../dtos/validate-tfa.request.dto";
import { ValidateTFAResponseDto } from "../dtos/validate-tfa.response.dto";
import { Authentication } from "../decorators/authentication.decorator";
import { AuthenticationType } from "../enums/authentication-type.enum";
import { RefreshTokenUC } from "../usecases/refresh-token.uc";
import { RefreshTokenRequestDto } from "../dtos/refresh-token.request.dto";
import { RefreshTokenResponseDto } from "../dtos/refresh-token.response.dto";
import { Response } from "express";
import { LogoutUC } from "../usecases/logout.uc";
import { Recaptcha } from "@nestlab/google-recaptcha";
import { LangClientInterceptor } from "../interceptors/lang-client.interceptor";

@Controller('authentication')
@Authentication(AuthenticationType.None)
export class AuthenticationController {

    constructor(
        private readonly loginUC: LoginUC,
        private readonly validateTfaUC: ValidateTfaUC,
        private readonly refreshTokenUC: RefreshTokenUC,
        private readonly logoutUC: LogoutUC
    ) { }

    @Post('login')
    @UseInterceptors(IpClientInterceptor, LangClientInterceptor)
    @Recaptcha()
    @HttpCode(HttpStatus.OK)
    async login(
        @Res({ passthrough: true }) response: Response,
        @Body() dto: LoginRequestDto
    ): Promise<LoginResponseDto> {

        dto.setResponse(response);
        return this.loginUC.execute(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('validate-tfa')
    validateTfa(
        @Res({ passthrough: true }) response: Response,
        @Body() dto: ValidateTFARequestDto): Promise<ValidateTFAResponseDto> {
        dto.setResponse(response);
        return this.validateTfaUC.execute(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Authentication(AuthenticationType.JwtCookies)
    @Post('logout')
    logout(@Res({ passthrough: true }) response: Response): void {
        this.logoutUC.execute(response);
    }

    // This endpoint is currently disabled due to the cookie server side with http only 
    // flag implementation
    @HttpCode(HttpStatus.OK)
    // @Post('refresh-token')
    refreshToken(@Body() dto: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
        return this.refreshTokenUC.execute(dto);
    }
}