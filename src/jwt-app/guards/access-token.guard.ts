import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { USER_REQUEST_KEY } from '../../authentication/constants/authentication.constants';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { JwtAccessPayloadDto } from '../dtos/jwt/jwt-access-payload.dto';

@Injectable()
export class AccessTokenGuard implements CanActivate {

  private logger = new Logger(AccessTokenGuard.name);

  constructor(
    private readonly jwtStrategy: JwtStrategy
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {

      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        this.logger.error('Token not found');
        throw new UnauthorizedException();
      }

      const payload = await this.jwtStrategy.verify<JwtAccessPayloadDto>(token);
      request[USER_REQUEST_KEY] = payload;
      return true;

    } catch (error) {
      this.logger.error('Invalid token');
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
