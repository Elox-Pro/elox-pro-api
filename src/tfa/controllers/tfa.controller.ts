import { Body, Controller, HttpCode, HttpStatus, Ip, Post, Res, UseInterceptors } from "@nestjs/common";
import { ValidateTfaUC } from "../usecases/validate-tfa.uc";
import { AuthenticationType } from "@app/authentication/enums/authentication-type.enum";
import { Authentication } from "@app/authentication/decorators/authentication.decorator";
import { LangClientInterceptor } from "@app/common/interceptors/lang-client.interceptor";
import { ValidateTFARequestDto } from "../dtos/validate-tfa/validate-tfa.request.dto";
import { ValidateTFAResponseDto } from "../dtos/validate-tfa/validate-tfa.response.dto";
import { Response } from "express";
import { IpClientInterceptor } from "@app/common/interceptors/ip-client.interceptor";

@Controller('tfa')
@Authentication(AuthenticationType.None)
export class TfaController {

    constructor(
        private readonly validateTfaUC: ValidateTfaUC
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('validate')
    @UseInterceptors(LangClientInterceptor, IpClientInterceptor)
    validateTfa(
        @Res({ passthrough: true }) response: Response,
        @Body() dto: ValidateTFARequestDto): Promise<ValidateTFAResponseDto> {
        dto.setResponse(response);
        return this.validateTfaUC.execute(dto);
    }

}