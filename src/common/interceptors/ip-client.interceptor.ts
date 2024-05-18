import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as requestIp from 'request-ip';

@Injectable()
export class IpClientInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        request.body['ipClient'] = requestIp.getClientIp(request);
        return next.handle();
    }
}