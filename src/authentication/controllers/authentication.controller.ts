import { Body, Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { LoginUC } from "../usecases/login.uc";
import { LoginRequestDto } from "../dtos/login/login.request.dto";
import { LoginResponseDto } from "../dtos/login/login.response.dto";
import { Authentication } from "../decorators/authentication.decorator";
import { AuthenticationType } from "../enums/authentication-type.enum";
import { Response } from "express";
import { LogoutUC } from "../usecases/logout.uc";
import { Recaptcha } from "@nestlab/google-recaptcha";
import { SignupRequestDto } from "../dtos/signup/signup.request.dto";
import { SignupUC } from "../usecases/signup.uc";
import { SignupResponseDto } from "../dtos/signup/signup.response.dto";
import { GuestRequest } from "@app/authorization/decorators/guest.request.decorator";
import { GuestUserDto } from "@app/authorization/dto/guest-user.dto";

@Controller('authentication')
@Authentication(AuthenticationType.None)
export class AuthenticationController {

    constructor(
        private readonly signupUC: SignupUC,
        private readonly loginUC: LoginUC,
        private readonly logoutUC: LogoutUC
    ) { }

    @Post("signup")
    @Recaptcha()
    @HttpCode(HttpStatus.CREATED)
    signup(
        @GuestRequest() guestUserDto: GuestUserDto,
        @Body() dto: SignupRequestDto
    ): Promise<SignupResponseDto> {
        dto.setGuestUser(guestUserDto);
        return this.signupUC.execute(dto);
    }

    @Post('login')
    @Recaptcha()
    @HttpCode(HttpStatus.OK)
    async login(
        @Res({ passthrough: true }) response: Response,
        @GuestRequest() guestUserDto: GuestUserDto,
        @Body() dto: LoginRequestDto
    ): Promise<LoginResponseDto> {
        guestUserDto.setResponse(response);
        dto.setGuestUser(guestUserDto);
        return this.loginUC.execute(dto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @Authentication(AuthenticationType.JwtCookies)
    logout(@Res({ passthrough: true }) response: Response): void {
        this.logoutUC.execute(response);
    }

}