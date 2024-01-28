import { Injectable } from "@nestjs/common";
import { EmailTfa } from "../strategies/tfa/email-tfa.strategy";
import { TfaType } from "@prisma/client"
import { TfaStrategy } from "../strategies/tfa/tfa.strategy";

@Injectable()
export class TfaFactory {
    constructor(
        private readonly emailTfa: EmailTfa,
    ) { }

    getTfa(type: TfaType): TfaStrategy {
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