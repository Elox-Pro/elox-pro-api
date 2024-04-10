import { Translator } from "@app/common/translator/translator.interface";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { I18nService } from "nestjs-i18n";

@Injectable()
export class UserTranslator implements Translator<User> {

    constructor(private readonly i18n: I18nService) { }
    async translate(entity: User, lang: string): Promise<Map<string, string>> {

        const map = new Map<string, string>();
        map.set(entity.role, await this.i18n.t(entity.role, { lang }));

        return map;
    }
}