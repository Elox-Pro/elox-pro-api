import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JWTCookiesGuard implements CanActivate {

    private logger = new Logger(JWTCookiesGuard.name);

    canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const token = request.cookies.token;
            if (!token) {
                this.logger.error('Token not found');
                throw new UnauthorizedException();
            }
            return Promise.resolve(true);

        } catch (error) {
            this.logger.error('Invalid token');
            throw new UnauthorizedException();
        }
    }
}