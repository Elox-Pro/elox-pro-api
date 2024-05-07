import { Role } from "@prisma/client";
import { ActiveUserDto } from "./active-user.dto";
import { RequestLang } from "@app/common/enums/request-lang.enum";

export class UserRequestDto {

    private activeUser: ActiveUserDto;

    setActiveUser(activeUser: ActiveUserDto) {
        this.activeUser = activeUser;
    }

    getUsername(): string {
        return this.activeUser.username;
    }

    getRole(): Role {
        return this.activeUser.role;
    }

    getLang(): RequestLang {
        return this.activeUser.getLang();
    }

    getIp(): string {
        return this.activeUser.getIp();
    }

    isAuthenticated(): boolean {
        return this.activeUser.isAuthenticated;
    }
}