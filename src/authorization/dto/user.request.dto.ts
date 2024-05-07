import { Role } from "@prisma/client";
import { ActiveUserDto } from "./active-user.dto";
import { RequestLang } from "@app/common/enums/request-lang.enum";

export class UserRequestDto {

    private userRequest: ActiveUserDto;

    setUserRequest(userRequest: ActiveUserDto) {
        this.userRequest = userRequest;
    }

    getUsername(): string {
        return this.userRequest.username;
    }

    getRole(): Role {
        return this.userRequest.role;
    }

    getLang(): RequestLang {
        return this.userRequest.getLang();
    }

    getIp(): string {
        return this.userRequest.ip;
    }

    isAuthenticated(): boolean {
        return this.userRequest.isAuthenticated;
    }
}