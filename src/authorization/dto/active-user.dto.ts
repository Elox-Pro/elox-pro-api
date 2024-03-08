import { Role } from "@prisma/client";

export class ActiveUserDto {

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
         * Whether the user is active
         */
        readonly isAuthenticated: boolean
    ) {

    }
}