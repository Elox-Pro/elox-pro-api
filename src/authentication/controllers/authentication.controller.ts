import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors } from "@nestjs/common";
import { LoginUC } from "../usecases/login.uc";
import { LoginDto } from "../dtos/login.dto";
import { IpClientInterceptor } from "../interceptors/ip-client.interceptor";
import { LoginResponseDto } from "../dtos/login-response.dto";
import { ValidateTfaUC } from "../usecases/validate-tfa.uc";
import { ValidateTfaDto } from "../dtos/validate-tfa.dto";
import { ValidateTfaResponseDto } from "../dtos/validate-tfa-response.dto";

@Controller('authentication')
export class AuthenticationController {

    constructor(
        private loginUC: LoginUC,
        private validateTfaUC: ValidateTfaUC,
    ) { }

    @UseInterceptors(IpClientInterceptor)
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
        return this.loginUC.execute(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('validate-tfa')
    validateTfa(@Body() dto: ValidateTfaDto): Promise<ValidateTfaResponseDto> {
        return this.validateTfaUC.execute(dto);
    }
}