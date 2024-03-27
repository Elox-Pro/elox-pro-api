import { UserLang } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Response } from "express";

export class ValidateTFARequestDto {

    @IsNumber()
    @IsNotEmpty()
    public readonly code: number;

    @IsString()
    @IsNotEmpty()
    public readonly username: string;

    @IsEnum(UserLang)
    readonly lang: UserLang;

    private response: Response;

    setResponse(response: Response): void {
        this.response = response;
    }

    getResponse(): Response {
        return this.response;
    }
}