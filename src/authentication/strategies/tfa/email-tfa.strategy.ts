import { Injectable } from "@nestjs/common";
import { TfaStrategy } from "./tfa.strategy";
import { TfaDTO } from "src/authentication/dtos/tfa.dto";

@Injectable()
export class EmailTfa extends TfaStrategy {
    async send(tfaDto: TfaDTO): Promise<string> {
        console.log("Send by email");
        return Promise.resolve("Send by email");
    }
    async verify(token: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}