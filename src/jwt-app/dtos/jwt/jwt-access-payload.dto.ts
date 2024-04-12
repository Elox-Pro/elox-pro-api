import { Role, UserLang } from "@prisma/client";

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

        /**
         * The language of the user
         */
        readonly lang: UserLang

    ) { }
}