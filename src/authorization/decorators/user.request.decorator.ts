import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { USER_REQUEST_KEY } from '@app/authentication/constants/authentication.constants';
import { ActiveUserDto } from '../dto/active-user.dto';
import { UserLang } from '@prisma/client';

export const UserRequest = createParamDecorator(
    (field: keyof ActiveUserDto, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        let user: ActiveUserDto = request[USER_REQUEST_KEY];

        if (user.lang === UserLang.DEFAULT) {
            console.warn("The user session or request language is not working well, please check it.");
            user = {
                ...user,
                lang: UserLang.EN,
            }
        }

        return field ? user?.[field] : user;
    },
);