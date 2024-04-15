import { Avatar } from "@prisma/client";

export class FindManyAvatarsResponsetDto {
    constructor(readonly avatars: Avatar[]) { }
}