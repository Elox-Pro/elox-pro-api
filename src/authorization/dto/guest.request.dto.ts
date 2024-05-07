import { Request, Response } from "express";
import { RequestLang } from "@app/common/enums/request-lang.enum";
import { GuestUserDto } from "./guest-user.dto";
import { BadRequestException } from "@nestjs/common";

export class GuestRequestDto {

    private guestUser: GuestUserDto;

    setGuestUser(guestUser: GuestUserDto) {
        this.guestUser = guestUser;
    }

    getLang(): RequestLang {

        if (!this.guestUser || !this.guestUser.getLang()) {
            throw new BadRequestException("Language not set");
        }

        return this.guestUser.getLang();
    }

    getIp(): string {

        if (!this.guestUser || !this.guestUser.getIp()) {
            throw new BadRequestException("Ip address not set");
        }

        return this.guestUser.getIp();
    }

    getRequest(): Request {

        if (!this.guestUser || !this.guestUser.getRequest()) {
            throw new BadRequestException("Request not set");
        }

        return this.guestUser.getRequest();
    }

    getResponse(): Response {

        if (!this.guestUser || !this.guestUser.getResponse()) {
            throw new BadRequestException("Response not set");
        }

        return this.guestUser.getResponse();
    }

}