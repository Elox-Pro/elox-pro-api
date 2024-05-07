import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { USER_REQUEST_KEY } from '@app/authentication/constants/authentication.constants';
import { ActiveUserDto } from '../dto/active-user.dto';
import { getRequestLang } from '@app/common/helpers/get-request-lang.helper';
import { getClientIp } from 'request-ip';

export const UserRequest = createParamDecorator((field: keyof ActiveUserDto, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const auxUser: ActiveUserDto = request[USER_REQUEST_KEY];
    const lang = getRequestLang(request);
    const ip = getClientIp(request);
    const user = new ActiveUserDto(auxUser.username, auxUser.role, auxUser.isAuthenticated);
    user.setLang(lang);
    user.setIp(ip);
    return field ? user?.[field] : user;
});