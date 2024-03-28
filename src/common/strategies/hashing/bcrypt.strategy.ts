import { Injectable } from "@nestjs/common";
import { HashingStrategy } from "./hashing.strategy";
import { genSalt, hash, compare } from "bcrypt";

@Injectable()
export class BCryptStategy implements HashingStrategy {
    async hash(data: string): Promise<string> {
        return hash(data, await genSalt(10));
    }
    async compare(data: string, hash: string): Promise<boolean> {
        return await compare(data, hash);
    }
}
