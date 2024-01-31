import { User } from "@prisma/client";

export class TfaDto {
    constructor(
        readonly user: User,
        readonly ipClient: string
    ) { }
}