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
         * The user language (it is setted when the session cookie is created)
         */
        readonly lang: UserLang,

        /**
         * The user request ip address (it is setted when the session cookie is created)
         */
        readonly ip: string,

        /**
         * Whether the user is active
         */
        readonly isAuthenticated: boolean,
    ) {

    }
}