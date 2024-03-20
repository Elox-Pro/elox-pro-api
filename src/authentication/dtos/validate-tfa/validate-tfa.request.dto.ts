import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Response } from "express";

export class ValidateTFARequestDto {

    @IsNumber()
    @IsNotEmpty()
    public readonly code: number;

    @IsString()
    @IsNotEmpty()
    public readonly username: string;

    private response: Response;

    setResponse(response: Response): void {
        this.response = response;
    }

    getResponse(): Response {
        return this.response;
    }
}