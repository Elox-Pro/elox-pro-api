import { Role } from "@prisma/client";
import { ActiveUserDto } from "./active-user.dto";
import { RequestLang } from "@app/common/enums/request-lang.enum";

export interface IUserRequestDto {

    setActiveUser(activeUser: ActiveUserDto);

    getUsername(): string;

    getRole(): Role;

    getLang(): RequestLang;

    getIp(): string;

    isAuthenticated(): boolean;
}