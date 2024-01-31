import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseInterceptors } from "@nestjs/common";
import { LoginUC } from "../usecases/login.uc";
import { LoginDto } from "../dtos/login.dto";
import { IpClientInterceptor } from "../interceptors/ip-client.interceptor";

@Controller('authentication')
@UseInterceptors(IpClientInterceptor)
export class AuthenticationController {

    constructor(private loginUC: LoginUC) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.loginUC.execute(loginDto);
    }
}
