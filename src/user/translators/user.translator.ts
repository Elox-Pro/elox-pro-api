import { MODEL_KEY } from "@app/common/constants/common.constants";
import { Translator } from "@app/common/translator/translator.interface";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { I18nService } from "nestjs-i18n";

@Injectable()
export class UserTranslator implements Translator<User> {

    constructor(private readonly i18n: I18nService) { }
    async translate(
        entity: User, lang: string): Promise<Record<string, string>> {

        const records = {};
        records[entity.role] = await this.getValue(entity.role, lang);
        records[entity.gender] = await this.getValue(entity.gender, lang);
        return records;

    }

    // TODO: Move to helper class UserTranslatorHelper
    private async getValue(key: string, lang: string): Promise<string> {
        return await this.i18n.t(MODEL_KEY + key, { lang });
    }
}