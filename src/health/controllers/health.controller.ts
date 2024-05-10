import { Authentication } from "@app/authentication/decorators/authentication.decorator";
import { AuthenticationType } from "@app/authentication/enums/authentication-type.enum";
import { SuccessResponseDto } from "@app/common/dto/success.response.dto";
import { Controller, Get } from "@nestjs/common";

@Authentication(AuthenticationType.None)
@Controller('health')
export class HealthController {

    @Get()
    getHealth(): SuccessResponseDto {
        return new SuccessResponseDto(true)
    }

}