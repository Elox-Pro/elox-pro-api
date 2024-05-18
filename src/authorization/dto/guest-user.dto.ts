import { RequestLang } from "@app/common/enums/request-lang.enum";
import { Request, Response } from "express";

export class GuestUserDto {

    private lang: RequestLang;
    private ip: string;
    private response: Response;
    private request: Request;

    setLang(lang: RequestLang) {
        this.lang = lang;
    }

    getLang(): RequestLang {
        return this.lang;
    }

    setIp(ip: string) {
        this.ip = ip;
    }

    getIp(): string {
        return this.ip;
    }
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