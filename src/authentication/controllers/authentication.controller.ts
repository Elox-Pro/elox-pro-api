import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseInterceptors } from "@nestjs/common";
import { LoginUC } from "../usecases/login.uc";
import { LoginRequestDto } from "../dtos/login/login.request.dto";
import { IpClientInterceptor } from "../../common/interceptors/ip-client.interceptor";
import { LoginResponseDto } from "../dtos/login/login.response.dto";
import { Authentication } from "../decorators/authentication.decorator";
import { AuthenticationType } from "../enums/authentication-type.enum";
import { Response } from "express";
import { LogoutUC } from "../usecases/logout.uc";
import { Recaptcha } from "@nestlab/google-recaptcha";
import { LangClientInterceptor } from "../../common/interceptors/lang-client.interceptor";
import { SignupRequestDto } from "../dtos/signup/signup.request.dto";
import { SignupUC } from "../usecases/signup.uc";
import { SignupResponseDto } from "../dtos/signup/signup.response.dto";

@Controller('authentication')
@Authentication(AuthenticationType.None)
export class AuthenticationController {

    constructor(
        private readonly signupUC: SignupUC,
        private readonly loginUC: LoginUC,
        private readonly logoutUC: LogoutUC
    ) { }

    @Post("signup")
    @UseInterceptors(IpClientInterceptor, LangClientInterceptor)
    @Recaptcha()
    @HttpCode(HttpStatus.CREATED)
    signup(
        @Body() dto: SignupRequestDto
    ): Promise<SignupResponseDto> {

        return this.signupUC.execute(dto);

    }

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

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @Authentication(AuthenticationType.JwtCookies)
    logout(@Res({ passthrough: true }) response: Response): void {
        this.logoutUC.execute(response);
    }

}