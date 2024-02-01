import { Role } from "@prisma/client";

export class JwtInputDto {
    readonly userId: number;
    readonly role: Role;
    readonly email: string;
}