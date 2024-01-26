import { Role } from "@prisma/client";
import { IsBoolean, IsEmail, IsEnum, IsString } from "class-validator";

export class CreateUserDTO {

    @IsEnum(Role)
    readonly role: Role;

    @IsString()
    readonly username: string;

    @IsEmail()
    readonly email: string;

    @IsString()
    readonly password: string;

    @IsBoolean()
    readonly emailVerified: boolean;
}