import { Role } from "@prisma/client";

export class JwtInputDto {
    constructor(
        readonly userId: number,
        readonly role: Role,
        readonly username: string
    ) { }
}