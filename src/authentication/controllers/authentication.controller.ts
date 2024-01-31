import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { LoginUC } from "../usecases/login.uc";
import { LoginDTO } from "../dtos/login.dto";

@Controller('authentication')
export class AuthenticationController {
    constructor(private loginUC: LoginUC) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() loginDto: LoginDTO) {
        return this.loginUC.execute(loginDto);
    }
}
