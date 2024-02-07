import { Injectable } from "@nestjs/common";
import { EmailTfaStrategy as EmailTFAStrategy } from "../strategies/tfa/email-tfa.strategy";
import { TfaType } from "@prisma/client"
import { TfaStrategy as TFAStrategy } from "../strategies/tfa/tfa.strategy";

@Injectable()
export class TFAFactory {
    constructor(
        private readonly emailTfa: EmailTFAStrategy,
    ) { }

    getTfaStrategy(type: TfaType): TFAStrategy {
        switch (type) {
            case TfaType.NONE:
                return null;
            case TfaType.EMAIL:
                return this.emailTfa;
            default:
                throw new Error("Invalid TFA type");
        }
    }
}