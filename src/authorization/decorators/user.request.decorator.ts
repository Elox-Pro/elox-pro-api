import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { USER_REQUEST_KEY } from '@app/authentication/constants/authentication.constants';
import { ActiveUserDto } from '../dto/active-userdto';

export const UserRequest = createParamDecorator(
    (field: keyof ActiveUserDto, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user: ActiveUserDto = request[USER_REQUEST_KEY];
        return field ? user?.[field] : user;
    },
);