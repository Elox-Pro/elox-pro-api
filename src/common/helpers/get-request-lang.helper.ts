import { Request } from "express";
import { RequestLang } from "../enums/request-lang.enum";
import { BadRequestException } from "@nestjs/common";

/**
 * Parses the Accept-Language header to extract language codes.
 *
 * @param {string} header - The Accept-Language header value.
 * @returns {string[]} - An array of language codes extracted from the header.
 */
function parseAcceptLangHeader(header: string): string[] {
    return header.split(",").map(lang => lang.trim().split(";")[0]);
}

/**
 * Finds a valid language code from the list of accepted languages.
 *
 * @param {string[]} languages - The list of accepted language codes.
 * @returns {RequestLang | null} - The valid language code or null if none found.
 */
function findValidLangCode(languages: string[]): RequestLang | null {
    for (const lang of languages) {
        const code = lang.split("-")[0].toUpperCase();
        if (Object.values(RequestLang).includes(code as RequestLang)) {
            return code as RequestLang;
        }
    }
    return null;
}

/**
 * Extracts the request language from the Accept-Language header.
 * Throws BadRequestException if header is missing or invalid.
 *
 * @param {Request} req - The Express request object.
 * @returns {RequestLang} - The extracted request language.
 * @throws {BadRequestException} - If Accept-Language header is missing or invalid.
 */
export function getRequestLang(req: Request): RequestLang {
    const acceptLangHeader = req.headers['accept-language'];

    if (!acceptLangHeader || typeof acceptLangHeader !== 'string' || acceptLangHeader.trim().length === 0) {
        throw new BadRequestException("Accept-Language header is missing or empty");
    }

    const acceptedLanguages = parseAcceptLangHeader(acceptLangHeader);
    const requestLang = findValidLangCode(acceptedLanguages);

    if (!requestLang) {
        throw new BadRequestException("No valid language code found in Accept-Language header");
    }

    return requestLang;
}