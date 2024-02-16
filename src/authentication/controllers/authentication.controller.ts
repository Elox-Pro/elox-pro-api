import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseInterceptors } from "@nestjs/common";
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
    login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
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

    @HttpCode(HttpStatus.OK)
    @Get('test')
    test() {
        return { result: 'test' };
    }
}