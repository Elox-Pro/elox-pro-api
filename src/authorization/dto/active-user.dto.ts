import { Role, UserLang } from "@prisma/client";

export class ActiveUserDto {

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
         * The user language
         */
        readonly lang: UserLang,

        /**
         * Whether the user is active
         */
        readonly isAuthenticated: boolean
    ) {

    }
}