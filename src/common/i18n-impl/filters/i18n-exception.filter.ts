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

        if (exception.message.startsWith('error.')) {

            const translatedMessage = await this.i18n.t(exception.message, {
                lang: I18nContext.current().lang
            });

            return response.status(status).json({
                statusCode: status,
                message: translatedMessage,
            });
        }

        const errorResponse = exception.getResponse() as {
            statusCode: number;
            message: string;
            error: string;
        }

        return response.status(status).json({
            statusCode: errorResponse.statusCode || status,
            message: errorResponse.message || exception.message,
        });

    }
}


