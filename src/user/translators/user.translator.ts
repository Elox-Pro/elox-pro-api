import { TranslatorService } from "@app/common/services/translator.service";
import { Translator } from "@app/common/translator/translator.interface";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

@Injectable()
export class UserTranslator implements Translator<User> {

    constructor(private readonly t: TranslatorService) { }
    async translate(entity: User, lang: string): Promise<Record<string, string>> {
        const records = {};
        records[entity.role] = await this.t.getValue(entity.role, lang);
        records[entity.gender] = await this.t.getValue(entity.gender, lang);
        records[entity.lang] = await this.t.getValue(entity.lang, lang);
        records[entity.theme] = await this.t.getValue(entity.theme, lang);
        return records;

    }
}