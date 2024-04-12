import { TranslatorService } from "@app/common/services/translator.service";
import { Translator } from "@app/common/translator/translator.interface";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

/**
 * A translator service specifically designed for translating user-related data.
 * Implements the Translator interface.
 * @author Yonatan A Quintero R
 * @date 2024-04-12
 */
@Injectable()
export class UserTranslator implements Translator<User> {

    constructor(private readonly t: TranslatorService) { }

    /**
     * Translates user-related data based on the specified language.
     * @param entity The User entity containing the data to translate.
     * @param lang The language code specifying the target language for translation.
     * @returns A record of translated data where keys correspond to entity properties.
     */
    async translate(entity: User, lang: string): Promise<Record<string, string>> {
        const records = {};

        // Translate user role, gender, language, and theme
        records[entity.role] = await this.t.getValue(entity.role, lang);
        records[entity.gender] = await this.t.getValue(entity.gender, lang);
        records[entity.lang] = await this.t.getValue(entity.lang, lang);
        records[entity.theme] = await this.t.getValue(entity.theme, lang);

        return records;
    }
}