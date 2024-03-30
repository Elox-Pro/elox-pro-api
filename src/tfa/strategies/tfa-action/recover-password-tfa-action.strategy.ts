import { Injectable } from "@nestjs/common";
import { TfaActionStrategy } from "./tfa-action.strategy";
import { ValidateTFARequestDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.request.dto";
import { ValidateTFAResponseDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.response.dto";
import { User } from "@prisma/client";
import { TfaAction } from "@app/tfa/enums/tfa-action.enum";

@Injectable()
export class RecoverPasswordTfaActionStrategy extends TfaActionStrategy {
    async execute(data: ValidateTFARequestDto, user: User): Promise<ValidateTFAResponseDto> {
        return new ValidateTFAResponseDto(user.tfaType, TfaAction.RECOVER_PASSWORD);
    }
}