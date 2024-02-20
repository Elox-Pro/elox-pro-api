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
    login(@Res({ passthrough: true }) response: Response, @Req() request: Request, @Body() dto: LoginRequestDto): Promise<LoginResponseDto> {

        // response.cookie('refreshToken', '1111', {
        //     domain: '.localhost',
        //     expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: true,
        //     path: '/'
        // })
        // response.cookie('username', dto.username)
        response.cookie('refreshToken', '1111', {
            domain: '.eloxpro-dev.com',
            httpOnly: true,
        })
        console.log(request.cookies)
        console.log(request.cookies)
        // response.status(HttpStatus.OK).send(this.loginUC.execute(dto));
        return this.loginUC.execute(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('validate-tfa')
    validateTfa(@Body() dto: ValidateTFARequestDto): Promise<ValidateTFAResponseDto> {
        return this.validateTfaUC.execute(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
    refreshToken(@Body() dto: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
        return this.refreshTokenUC.execute(dto);
    }
}