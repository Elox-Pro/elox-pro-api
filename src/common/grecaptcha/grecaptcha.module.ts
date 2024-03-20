import { Enviroment } from '@app/app.constants';
import { Module } from '@nestjs/common';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

@Module({
    imports: [
        GoogleRecaptchaModule.forRoot({
            secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
            response: request => request.body["grecaptchaToken"],
            skipIf: process.env.ENVIRONMENT !== Enviroment.PRODUCTION,
        })
    ]
})
export class GRecaptchaModule { }