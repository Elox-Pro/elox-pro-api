import { Body, Controller, HttpCode, HttpStatus } from "@nestjs/common";
import { Authentication } from "@app/authentication/decorators/authentication.decorator";
import { AuthenticationType } from "@app/authentication/enums/authentication-type.enum";
import { RefreshTokenUC } from "../usecases/refresh-token.uc";
import { RefreshTokenRequestDto } from "../dtos/refresh-token/refresh-token.request.dto";
import { RefreshTokenResponseDto } from "../dtos/refresh-token/refresh-token.response.dto";

@Controller('jwt')
@Authentication(AuthenticationType.None)
export class JwtController {

    constructor(
        private readonly refreshTokenUC: RefreshTokenUC,
    ) { }

    // This endpoint is currently disabled due to the cookie server side with http only 
    // flag implementation
    @HttpCode(HttpStatus.OK)
    // @Post('refresh-token')
    refreshToken(@Body() dto: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
        return this.refreshTokenUC.execute(dto);
    }
}