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
import { Request, Response } from "express";
import { AppConfig } from "@app/app.config";
import { JwtTokensDto } from "../dtos/jwt-tokens.dto";
import JWTCookieService from "../services/jwt-cookie.service";

@Controller('authentication')
@Authentication(AuthenticationType.None)
export class AuthenticationController {

    constructor(
        private readonly loginUC: LoginUC,
        private readonly validateTfaUC: ValidateTfaUC,
        private readonly refreshTokenUC: RefreshTokenUC
    ) { }

    @UseInterceptors(IpClientInterceptor)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(
        @Res({ passthrough: true }) response: Response,
        @Body() dto: LoginRequestDto
    ): Promise<LoginResponseDto> {

        dto.setResponse(response);
        return this.loginUC.execute(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('validate-tfa')
    validateTfa(@Body() dto: ValidateTFARequestDto): Promise<ValidateTFAResponseDto> {
        dto.setResponse(dto.getResponse());
        return this.validateTfaUC.execute(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
    refreshToken(@Body() dto: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
        return this.refreshTokenUC.execute(dto);
    }
}