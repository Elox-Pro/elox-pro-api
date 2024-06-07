import { PaginationRequestDto } from "@app/common/dto/pagination.request.dto";
import { UserRequestDto } from "./user.request.dto";
import { ActiveUserDto } from "./active-user.dto";
import { RequestLang } from "@app/common/enums/request-lang.enum";
import { IUserRequestDto } from "./user.request.dto.interface";
import { Role } from "@prisma/client";
import { IsOptional } from "class-validator";

export class UserPaginationRequestDto extends PaginationRequestDto implements IUserRequestDto {

    @IsOptional()
    private userRequest: UserRequestDto;

    constructor() {
        super();
        this.userRequest = new UserRequestDto();
    }

    setActiveUser(activeUser: ActiveUserDto) {
        this.userRequest.setActiveUser(activeUser);
    }

    getUsername(): string {
        return this.userRequest.getUsername();
    }
    getRole(): Role {
        return this.userRequest.getRole();
    }
    getIp(): string {
        return this.userRequest.getIp();
    }
    isAuthenticated(): boolean {
        return this.userRequest.isAuthenticated();
    }

    getLang(): RequestLang {
        return this.userRequest.getLang();
    }
}