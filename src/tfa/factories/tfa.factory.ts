import { Injectable } from "@nestjs/common";
import { EmailTfaStrategy } from "../strategies/email-tfa.strategy";
import { TfaType } from "@prisma/client"
import { TfaStrategy } from "../strategies/tfa.strategy";

@Injectable()
export class TfaFactory {
    constructor(
        private readonly emailTfa: EmailTfaStrategy,
    ) { }

    getTfaStrategy(type: TfaType): TfaStrategy {
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