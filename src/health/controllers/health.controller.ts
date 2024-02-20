import { Authentication } from "@app/authentication/decorators/authentication.decorator";
import { AuthenticationType } from "@app/authentication/enums/authentication-type.enum";
import { Controller, Get } from "@nestjs/common";

@Authentication(AuthenticationType.None)
@Controller('health')
export class HealthController {

    @Get()
    getHealth(): string {
        return 'OK';
    }

}