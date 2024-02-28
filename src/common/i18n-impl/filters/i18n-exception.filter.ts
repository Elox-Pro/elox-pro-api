import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class I18nExceptionFilter implements ExceptionFilter {
    constructor(private readonly i18n: I18nService) { }

    async catch(exception: HttpException, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const messageKey = exception.message || 'error.internal-server';
        const translatedMessage = await this.i18n.t(messageKey, {
            lang: I18nContext.current().lang
        });

        response.status(status).json({
            statusCode: status,
            message: translatedMessage,
        });
    }
}
