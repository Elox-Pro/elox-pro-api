import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { USER_REQUEST_KEY } from '@app/authentication/constants/authentication.constants';
import { ActiveUserDto } from '../dto/active-user.dto';
import { getRequestLang } from '@app/common/helpers/get-request-lang.helper';
import { getClientIp } from 'request-ip';

export const UserRequest = createParamDecorator((field: keyof ActiveUserDto, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const auxUser: ActiveUserDto = request[USER_REQUEST_KEY];

    const user = new ActiveUserDto(
        auxUser.username,
        auxUser.role,
        auxUser.avatarUrl,
        auxUser.isAuthenticated);

    user.setLang(getRequestLang(request));
    user.setIp(getClientIp(request));

    return field ? user?.[field] : user;
});