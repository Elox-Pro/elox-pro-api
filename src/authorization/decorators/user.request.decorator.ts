import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { USER_REQUEST_KEY } from '@app/authentication/constants/authentication.constants';
import { UserRequestDto } from '../dto/user.request.dto';

export const UserRequest = createParamDecorator(
    (field: keyof UserRequestDto, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user: UserRequestDto = request[USER_REQUEST_KEY];
        return field ? user?.[field] : user;
    },
);