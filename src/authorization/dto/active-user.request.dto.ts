import { Role, UserLang } from "@prisma/client";
import { ActiveUserDto } from "./active-user.dto";

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

    getLang(): UserLang {
        return this.userRequest.lang;
    }
}