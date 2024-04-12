import { Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { MODEL_KEY } from "../constants/common.constants";

/**
 * Service for translating values using the nestjs-i18n package.
 * Retrieves localized values based on keys and language codes.
*  @author Yonatan A Quintero R
 * @date 2024-04-12
 */
@Injectable()
export class TranslatorService {

    constructor(private readonly i18n: I18nService) { }

    /**
     * Retrieves a localized value for a given key and language.
     * @param key The key or identifier for the value to translate.
     * @param lang The language code specifying the target language for translation.
     * @returns The translated value corresponding to the key in the specified language.
     */
    public async getValue(key: string, lang: string): Promise<string> {
        // Construct the full key by concatenating MODEL_KEY with the provided key
        const fullKey = MODEL_KEY + key;

        // Translate the full key using the specified language
        return await this.i18n.t(fullKey, { lang: lang.toLowerCase() });
    }
}
