import { RequestLang } from "@app/common/enums/request-lang.enum";
import { Role } from "@prisma/client";

export class ActiveUserDto {

    private lang: RequestLang;
    private ip: string;

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
         * Whether the user is active
         */
        readonly isAuthenticated: boolean,
    ) { }

    setLang(lang: RequestLang) {
        this.lang = lang;
    }

    getLang(): RequestLang {
        return this.lang;
    }

    setIp(ip: string) {
        this.ip = ip;
    }

    getIp(): string {
        return this.ip;
    }
}