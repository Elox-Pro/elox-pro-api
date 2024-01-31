import { IsString } from "class-validator";

export class LoginDTO {

    @IsString()
    readonly username: string;

    @IsString()
    readonly password: string;
}
