import { Injectable } from "@nestjs/common";
import { EmailTfaStrategy } from "../strategies/tfa/email-tfa.strategy";
import { TfaType } from "@prisma/client"
import { TfaStrategy } from "../strategies/tfa/tfa.strategy";

@Injectable()
export class TfaFactory {
    constructor(
        private readonly emailTfa: EmailTfaStrategy,
    ) { }

    createStrategy(type: TfaType): TfaStrategy {
        switch (type) {
            case TfaType.EMAIL:
                return this.emailTfa;
            default:
                throw new Error("Invalid type");
        }
    }
}