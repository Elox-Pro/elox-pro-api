import { UserLang } from "@prisma/client";
import { Request } from "express";
export function getAcceptLangReq(req: Request): UserLang {
    const acceptLang = req.headers['accept-language'];
    if (!acceptLang) {
        return UserLang.EN;
    }
    const langs = acceptLang.split(",");

    for (const lang of langs) {
        const parts = lang.trim().split(";")[0].split("-");
        const code = parts[0].toUpperCase();

        if (Object.values(UserLang).includes(code as UserLang)) {
            return code as UserLang;
        }
    }
    return UserLang.EN;
}