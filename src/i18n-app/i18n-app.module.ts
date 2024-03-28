import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { I18nModule, AcceptLanguageResolver, I18nJsonLoader } from 'nestjs-i18n';
import * as path from 'path';
import { I18nExceptionFilter } from "./filters/i18n-exception.filter";

@Module({
    imports: [
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loader: I18nJsonLoader,
            loaderOptions: {
                path: path.join(__dirname, '../i18n/'),
                watch: process.env.ENVIRONMENT === 'development',
            },
            resolvers: [
                AcceptLanguageResolver,
            ]
        }),
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: I18nExceptionFilter,
        }
    ],
})
export class I18nAppModule { }