import { Role } from "@prisma/client";

export class JwtAccessPayloadDto {

    /**
     * The expiration date of the token
     */
    readonly exp: number

    constructor(

        /**
         * The subject is the username
         */
        readonly sub: string,

        /**
         * The role of the user
         */
        readonly role: Role,

    ) { }
}