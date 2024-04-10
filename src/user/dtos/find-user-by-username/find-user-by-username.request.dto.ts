import { UserLang } from "@prisma/client";
import { IsString } from "class-validator";

export class FindUserByUsernameRequestDto {

    @IsString()
    readonly lang: UserLang;

    private username: string

    setUsername(username: string): void {
        this.username = username;
    }

    getUsername(): string {
        return this.username;
    }
}