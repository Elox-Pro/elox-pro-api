import { Authentication } from "@app/authentication/decorators/authentication.decorator";
import { AuthenticationType } from "@app/authentication/enums/authentication-type.enum";
import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors } from "@nestjs/common";
import { RecoverPasswordInitUC } from "../usecases/recover-password-init.uc";
import { IpClientInterceptor } from "@app/common/interceptors/ip-client.interceptor";
import { LangClientInterceptor } from "@app/common/interceptors/lang-client.interceptor";
import { Recaptcha } from "@nestlab/google-recaptcha";
import { RecoverPasswordInitRequestDto } from "../dtos/recover-password-init/recover-password-init.request.dto";
import { RecoverPasswordInitResponseDto } from "../dtos/recover-password-init/recover-password-init.response.dto";

@Controller('recover-password')
@Authentication(AuthenticationType.None)
export class RecoverPasswordController {

    constructor(
        private readonly recoverPasswordInitUC: RecoverPasswordInitUC,
    ) { }

    @Post('init')
    @UseInterceptors(IpClientInterceptor, LangClientInterceptor)
    @Recaptcha()
    @HttpCode(HttpStatus.OK)
    async init(
        @Body() dto: RecoverPasswordInitRequestDto
    ): Promise<RecoverPasswordInitResponseDto> {
        return await this.recoverPasswordInitUC.execute(dto);
    }

}