import { Injectable } from "@nestjs/common";
import { IHashingService } from "../interfaces/hashing.service.interface";
import { genSalt, hash, compare } from "bcrypt";

@Injectable()
export class BcryptService implements IHashingService {
    async hash(data: string): Promise<string> {
        return hash(data, await genSalt(10));
    }
    compare(data: string, hash: string): Promise<boolean> {
        return compare(data, hash);
    }
}
