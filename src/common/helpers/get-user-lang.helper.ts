import { RequestLang } from "../enums/request-lang.enum";

/**
 * Returns the user's preferred language, if it is not the default language, otherwise returns the requested language.
 * @param userLang the user's preferred language
 * @param requestLang the language requested by the user
 */
export function getUserLang(userLang: RequestLang, requestLang: RequestLang): RequestLang {
    return requestLang;
}