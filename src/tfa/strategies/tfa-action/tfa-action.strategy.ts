import { ValidateTFARequestDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.request.dto";
import { ValidateTFAResponseDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.response.dto";
import { User } from "@prisma/client";

export abstract class TfaActionStrategy {
    abstract execute(
        request: ValidateTFARequestDto,
        user: User,
        metadata?: Record<string, string>
    ): Promise<ValidateTFAResponseDto>;
}