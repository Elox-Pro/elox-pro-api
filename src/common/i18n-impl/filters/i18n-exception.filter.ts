import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class I18nExceptionFilter implements ExceptionFilter {

    private readonly logger = new Logger(I18nExceptionFilter.name);

    constructor(private readonly i18n: I18nService) { }

    async catch(exception: HttpException, host: ArgumentsHost) {

        this.logger.error(JSON.stringify(exception));

        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        let messageKey = exception.message || 'error.internal-server';
        if (!messageKey.startsWith('error.')) {
            messageKey = `error.${messageKey}`;
        }
        const translatedMessage = await this.i18n.t(messageKey, {
            lang: I18nContext.current().lang
        });

        response.status(status).json({
            statusCode: status,
            message: translatedMessage,
        });
    }
}
