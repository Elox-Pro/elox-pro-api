import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

@Injectable()
export abstract class TfaStrategy {
    abstract generate(user: User): Promise<boolean>;
    abstract verify(id: string, token: string): Promise<boolean>;
} 