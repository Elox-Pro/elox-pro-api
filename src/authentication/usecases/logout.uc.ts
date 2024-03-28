import { Injectable } from "@nestjs/common";
import { IUseCase } from "@app/common/usecase/usecase.interface";
import { JwtCookieService } from "@app/jwt-app/services/jwt-cookie.service";
import { Response } from "express";

@Injectable()
export class LogoutUC implements IUseCase<Response, void> {

    constructor(
        private readonly jwtCookieService: JwtCookieService,
    ) { }

    async execute(response: Response): Promise<void> {
        this.jwtCookieService.deleteSession(response);
    }
}