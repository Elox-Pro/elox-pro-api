import { Role } from "@prisma/client";

export class GenerateTokensDTO {
    readonly userId: number;
    readonly role: Role;
    readonly email: string;
}