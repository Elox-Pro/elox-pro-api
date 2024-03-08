import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ActiveUserDto } from '../dto/active-user.dto';
import { USER_REQUEST_KEY } from '@app/authentication/constants/authentication.constants';

@Injectable()
export class RolesGuard implements CanActivate {

  private logger = new Logger(RolesGuard.name);

  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(context: ExecutionContext): boolean {

    const contextRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!contextRoles) {
      return true;
    }

    const user: ActiveUserDto = context.switchToHttp().getRequest()[USER_REQUEST_KEY];

    if (!user) {
      this.logger.error('User not found');
      throw new UnauthorizedException();
    }

    return contextRoles.some((role) => user.role === role);
  }

}
