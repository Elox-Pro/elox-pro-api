import { Role } from "@prisma/client";

export class JwtAccessPayloadDto {

    /**
     * The expiration date of the token
     */
    readonly exp: number

    constructor(

        /**
         * The username
         */
        readonly username: string,

        /**
         * The role of the user
         */
        readonly role: Role,

        /**
         * The user request ip address
         */
        readonly ip: string

    ) { }
}