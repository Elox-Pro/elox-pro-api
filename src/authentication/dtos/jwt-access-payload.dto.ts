import { Role } from "@prisma/client";

export class JwtAccessPayloadDto {
    constructor(
        readonly userId: number,
        readonly role: Role,
        readonly username: string
    ) { }
}