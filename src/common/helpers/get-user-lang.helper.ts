import { UserLang } from "@prisma/client";

/**
 * Returns the user's preferred language, if it is not the default language, otherwise returns the requested language.
 * @param userLang the user's preferred language
 * @param requestLang the language requested by the user
 */
export function getUserLang(userLang: UserLang, requestLang: UserLang): UserLang {

    if (userLang === UserLang.DEFAULT) {
        return requestLang;
    }
    return userLang;
}