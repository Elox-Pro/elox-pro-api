import { User } from "@prisma/client";

export class TFAResponseDto {
    constructor(
        readonly user: User,
        readonly ipClient: string
    ) { }
}