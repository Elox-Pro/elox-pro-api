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
    // Initialize the map for different authentication types and their respective guards
    this.authTypeGuardMap = new Map<AuthenticationType, CanActivate | CanActivate[]>();
    this.authTypeGuardMap.set(AuthenticationType.Bearer, this.accessTokenGuard);
    // For 'None' authentication type, allow access without any guard
    this.authTypeGuardMap.set(AuthenticationType.None, { canActivate: () => true });
  }

  /**
   * Determines whether the request should be allowed or denied based on authentication.
   * @param context The execution context.
   * @returns A boolean indicating whether the request should be allowed.
   * @throws UnauthorizedException if authentication fails.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Retrieve the authentication types specified for the current handler or class
    const authTypes = this.reflector.getAllAndOverride<AuthenticationType[]>(
      AUTHENTICATION_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [this.defaultAuthType];

    // Retrieve the guards associated with the authentication types
    const guards = authTypes.map((type) => this.authTypeGuardMap.get(type)).flat();

    let error = new UnauthorizedException();

    // Check each guard until one allows access or all fail
    for (const instance of guards) {
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err) => { error = err; });

      if (canActivate) {
        return true; // Access granted
      }
    }

    throw error; // Access denied, throw the error from the last guard
  }
}