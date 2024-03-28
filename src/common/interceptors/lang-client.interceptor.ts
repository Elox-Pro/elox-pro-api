import { getAcceptLangReq } from '@app/common/helpers/get-accept-lang-req.helper';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

//TODO: move to the common module
@Injectable()
export class LangClientInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        request.body['lang'] = getAcceptLangReq(request);
        return next.handle();
    }
}