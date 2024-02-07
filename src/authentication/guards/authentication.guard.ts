import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from './access-token.guard';
import { AuthenticationType } from '../enums/authentication-type.enum';
import { AUTHENTICATION_TYPE_KEY } from '../decorators/authentication.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  private readonly defaultAuthType = AuthenticationType.Bearer;
  private readonly authTypeGuardMap: Map<AuthenticationType, CanActivate | CanActivate[]>;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard
  ) {
    this.authTypeGuardMap = new Map<AuthenticationType, CanActivate | CanActivate[]>();
    this.authTypeGuardMap.set(AuthenticationType.Bearer, this.accessTokenGuard);
    this.authTypeGuardMap.set(AuthenticationType.None, { canActivate: () => true });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const authTypes = this.reflector.getAllAndOverride<AuthenticationType[]>(
      AUTHENTICATION_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [this.defaultAuthType];

    const guards = authTypes.map((type) => this.authTypeGuardMap.get(type)).flat();

    let error = new UnauthorizedException();

    for (const instance of guards) {

      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => { error = err; });

      if (canActivate) {
        return true;
      }
    }

    throw error;

  }
}
