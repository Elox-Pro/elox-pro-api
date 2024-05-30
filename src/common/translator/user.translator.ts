import { TranslatorService } from "@app/common/services/translator.service";
import { Translator } from "@app/common/translator/translator.interface";
import { UserType } from "@app/user/types/user.type";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

/**
 * A translator service specifically designed for translating user-related data.
 * Implements the Translator interface.
 * @author Yonatan A Quintero R
 * @date 2024-04-12
 */
@Injectable()
export class UserTranslator implements Translator<User, UserType> {

    constructor(private readonly t: TranslatorService) { }


    async translate(entity: User, lang: string): Promise<UserType> {
        return {
            ...entity,
            roleText: await this.t.getValue(entity.role, lang),
            genderText: await this.t.getValue(entity.gender, lang),
            tfaTypeText: await this.t.getValue(entity.tfaType, lang),
            langText: await this.t.getValue(entity.lang, lang),
            themeText: await this.t.getValue(entity.theme, lang),
        }
    }

}