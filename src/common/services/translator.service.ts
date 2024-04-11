import { Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { MODEL_KEY } from "../constants/common.constants";

@Injectable()
export class TranslatorService {

    constructor(private readonly i18n: I18nService) { }
    public async getValue(key: string, lang: string): Promise<string> {
        return await this.i18n.t(MODEL_KEY + key, { lang: lang.toLowerCase() });
    }
}