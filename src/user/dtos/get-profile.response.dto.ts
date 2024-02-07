import { User } from "@prisma/client";

export class GetProfileResponseDto {

    constructor(readonly user: User) { }
}