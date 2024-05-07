import { RequestLang } from "@app/common/enums/request-lang.enum";
import { IsString } from "class-validator";
import { Request, Response } from "express";
export class RecoverPasswordResetRequestDto {

    @IsString()
    readonly username: string;

    @IsString()
    readonly password1: string;

    @IsString()
    readonly password2: string;

    @IsString()
    readonly grecaptchaToken: string;

    @IsString()
    readonly lang: RequestLang;

    private request: Request;

    private response: Response;

    setRequest(request: Request): void {
        this.request = request;
    }

    getRequest(): Request {
        return this.request;
    }

    setResponse(response: Response): void {
        this.response = response;
    }

    getResponse(): Response {
        return this.response;
    }
}