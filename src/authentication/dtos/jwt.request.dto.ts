import { Role } from "@prisma/client";

export class JwtRequestDto {
    constructor(
        readonly userId: number,
        readonly role: Role,
        readonly username: string
    ) { }
}