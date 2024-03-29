import { AppConfig } from '@app/app.config';
import { Module } from '@nestjs/common';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

@Module({
    imports: [
        GoogleRecaptchaModule.forRoot({
            secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
            response: request => request.body["grecaptchaToken"]
        })
    ]
})
export class GRecaptchaModule { }