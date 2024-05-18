import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRequestLang } from '@app/common/helpers/get-request-lang.helper';
import { getClientIp } from 'request-ip';
import { GuestUserDto } from '../dto/guest-user.dto';

export const GuestRequest = createParamDecorator((field: keyof GuestUserDto, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const lang = getRequestLang(request);
    const ip = getClientIp(request);
    const user = new GuestUserDto();
    user.setLang(lang);
    user.setIp(ip);
    return field ? user?.[field] : user;
});