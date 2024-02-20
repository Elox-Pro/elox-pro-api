import { Role } from "@prisma/client";

export class JwtAccessPayloadDto {
    constructor(
        /**
         * The subject is the username
         */
        readonly sub: string,

        readonly role: Role
    ) { }
}