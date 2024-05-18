import { Role } from "@prisma/client";
import { IsBoolean, IsEmail, IsEnum, IsString } from "class-validator";

export class CreateUserDTO {

    @IsEnum(Role)
    readonly role: Role;

    @IsEmail()
    readonly email: string;

    @IsString()
    readonly username: string;

    @IsString()
    readonly password: string;

    @IsBoolean()
    readonly emailVerified: boolean;

    constructor(role: Role, email: string, username: string, password: string, emailVerified: boolean) {
        this.role = role;
        this.email = email;
        this.username = username;
        this.password = password;
        this.emailVerified = emailVerified;
    }
}