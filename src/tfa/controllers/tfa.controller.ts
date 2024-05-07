import { Body, Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { ValidateTfaUC } from "../usecases/validate-tfa.uc";
import { AuthenticationType } from "@app/authentication/enums/authentication-type.enum";
import { Authentication } from "@app/authentication/decorators/authentication.decorator";
import { ValidateTFARequestDto } from "../dtos/validate-tfa/validate-tfa.request.dto";
import { ValidateTFAResponseDto } from "../dtos/validate-tfa/validate-tfa.response.dto";
import { Response } from "express";
import { GuestRequest } from "@app/authorization/decorators/guest.request.decorator";
import { GuestUserDto } from "@app/authorization/dto/guest-user.dto";

@Controller('tfa')
@Authentication(AuthenticationType.None)
export class TfaController {

    constructor(
        private readonly validateTfaUC: ValidateTfaUC
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('validate')
    validateTfa(
        @Res({ passthrough: true }) response: Response,
        @GuestRequest() guestUserDto: GuestUserDto,
        @Body() dto: ValidateTFARequestDto
    ): Promise<ValidateTFAResponseDto> {
        guestUserDto.setResponse(response);
        dto.setGuestUser(guestUserDto);
        return this.validateTfaUC.execute(dto);
    }

}