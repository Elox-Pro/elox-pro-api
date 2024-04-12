import { Role, UserLang } from "@prisma/client";

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
         * The language of the user
         */
        readonly lang: UserLang

    ) { }
}