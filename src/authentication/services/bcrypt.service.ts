import { Injectable } from "@nestjs/common";
import { HashingService } from "./hashing.service";
import { genSalt, hash, compare } from "bcrypt";

@Injectable()
export class BCryptService implements HashingService {
    async hash(data: string): Promise<string> {
        return hash(data, await genSalt(10));
    }
    compare(data: string, hash: string): Promise<boolean> {
        return compare(data, hash);
    }
}
