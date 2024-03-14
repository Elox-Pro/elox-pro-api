import getAcceptLangReq from '@app/common/helpers/get-accept-lang-req.helper';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LangClientInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        request.body['lang'] = getAcceptLangReq(request);
        return next.handle();
    }
}