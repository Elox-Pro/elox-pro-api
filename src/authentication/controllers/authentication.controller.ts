import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseInterceptors } from "@nestjs/common";
import { LoginUC } from "../usecases/login.uc";
import { LoginDto } from "../dtos/login.dto";
import { IpClientInterceptor } from "../interceptors/ip-client.interceptor";
import { LoginResponseDTO } from "../dtos/login-response.dto";

@Controller('authentication')
@UseInterceptors(IpClientInterceptor)
export class AuthenticationController {

    constructor(private loginUC: LoginUC) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() loginDto: LoginDto): Promise<LoginResponseDTO> {
        return this.loginUC.execute(loginDto);
    }
}
