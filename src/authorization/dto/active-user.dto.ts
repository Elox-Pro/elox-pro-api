import { RequestLang } from "@app/common/enums/request-lang.enum";
import { Role } from "@prisma/client";

export class ActiveUserDto {

    private lang: RequestLang;

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
         * The user request ip address (it is setted when the session cookie is created)
         */
        readonly ip: string,

        /**
         * Whether the user is active
         */
        readonly isAuthenticated: boolean,
    ) {

    }

    setLang(lang: RequestLang) {
        this.lang = lang;
    }

    getLang(): RequestLang {
        return this.lang;
    }
}